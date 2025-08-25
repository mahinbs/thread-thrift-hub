import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, Sparkles, DollarSign, ArrowLeft, TrendingUp, Info, CheckCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { supabase } from '@/integrations/supabase/client';
import ScanningTips from '@/components/ScanningTips';

interface ScanResult {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidence: number;
  estimatedValue: number;
  suggestions: string[];
  category: string;
  brand: string;
  subcategory: string;
  material: string;
  conditionDetails: {
    fabricQuality: string;
    wearPatterns: string;
    stains: string;
    overallState: string;
  };
  marketInsights: {
    demandLevel: string;
    seasonalFactor: string;
    priceRange: {
      min: number;
      max: number;
      optimal: number;
    };
  };
}

const ScanClothes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanningStep, setScanningStep] = useState<string>('');
  const [needsPlayTrigger, setNeedsPlayTrigger] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<string>('checking');
  const [isInIframe, setIsInIframe] = useState(false);
  const [watchdogTimeout, setWatchdogTimeout] = useState<NodeJS.Timeout | null>(null);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'Good': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'Fair': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'Poor': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-muted';
    }
  };

  const checkVideoReady = useCallback(() => {
    if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
      setIsVideoReady(true);
      console.log('Video is ready for capture - dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
      return true;
    }
    return false;
  }, []);

  // Check if running in iframe
  useEffect(() => {
    setIsInIframe(window.top !== window.self);
  }, []);

  // Check camera permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if ('permissions' in navigator && 'query' in navigator.permissions) {
          const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setPermissionState(result.state);
          result.addEventListener('change', () => setPermissionState(result.state));
        }
      } catch (error) {
        console.log('Permissions API not available');
        setPermissionState('unknown');
      }
    };
    checkPermissions();
  }, []);

  // Readiness watchdog
  const startVideoWatchdog = useCallback(() => {
    if (watchdogTimeout) {
      clearTimeout(watchdogTimeout);
    }
    
    let attempts = 0;
    const maxAttempts = 12; // 3 seconds with 250ms intervals
    
    const checkReadiness = () => {
      if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
        setIsVideoReady(true);
        console.log('Video ready via watchdog - dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
        
        // Use requestVideoFrameCallback if available for immediate readiness
        if ('requestVideoFrameCallback' in videoRef.current) {
          (videoRef.current as any).requestVideoFrameCallback(() => {
            setIsVideoReady(true);
            console.log('Video frame callback - first frame received');
          });
        }
        return;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setWatchdogTimeout(setTimeout(checkReadiness, 250));
      } else {
        console.log('Video watchdog timeout - showing play trigger');
        setNeedsPlayTrigger(true);
        setCameraError('Camera preview not loading. Tap to retry.');
      }
    };
    
    setWatchdogTimeout(setTimeout(checkReadiness, 250));
  }, [watchdogTimeout]);

  const performAIScan = useCallback(async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanProgress(0);
    setScanningStep('Preparing image for analysis...');
    
    try {
      // Progress updates with specific steps
      const steps = [
        'Analyzing image quality...',
        'Detecting clothing items...',
        'Assessing condition...',
        'Identifying brand and category...',
        'Calculating market value...',
        'Generating recommendations...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setScanningStep(steps[i]);
        setScanProgress((i + 1) * 15);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setScanProgress(95);
      setScanningStep('Finalizing analysis...');

      // Call the actual AI analysis edge function
      const { data, error } = await supabase.functions.invoke('analyze-clothing', {
        body: { image: selectedImage }
      });

      if (error) {
        console.error('Error calling analyze-clothing function:', error);
        throw new Error(error.message);
      }

      if (data.error) {
        // Handle non-clothing items or other validation errors
        toast({
          title: "Invalid Image",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      const analysisResult = data.analysis;
      
      // Additional frontend validation for confidence threshold
      if (analysisResult.confidence < 70) {
        toast({
          title: "Low Confidence Analysis",
          description: "The image quality may be too low for accurate analysis. Please try with a clearer, well-lit photo.",
          variant: "destructive"
        });
        return;
      }

      // Check if it's actually a clothing category
      const clothingKeywords = ['shirt', 't-shirt', 'dress', 'pants', 'jeans', 'jacket', 'coat', 'sweater', 'blouse', 'skirt', 'shorts', 'shoe', 'boot', 'sneaker', 'bag', 'purse', 'jewelry', 'watch', 'belt', 'hat', 'scarf', 'sunglass'];
      const hasClothingKeyword = clothingKeywords.some(keyword => 
        analysisResult.category.toLowerCase().includes(keyword) || 
        analysisResult.subcategory.toLowerCase().includes(keyword)
      );
      
      if (!hasClothingKeyword) {
        toast({
          title: "Not a Clothing Item",
          description: "Please upload an image of clothing, shoes, bags, or fashion accessories.",
          variant: "destructive"
        });
        return;
      }

      setScanResult(analysisResult);
      setScanProgress(100);
      
      toast({
        title: "Analysis Complete!",
        description: `Condition: ${analysisResult.condition} • Estimated Value: $${analysisResult.estimatedValue}`,
      });

    } catch (error) {
      console.error('Error during AI scan:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again with a clearer photo.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
      setScanningStep('');
      setScanProgress(0);
    }
  }, [selectedImage, toast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);

    try {
      let processedFile: File | Blob = file;

      // Convert HEIC/HEIF to JPEG
      if (file.type === 'image/heic' || file.type === 'image/heif' || 
          file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
        
        console.log('Converting HEIC/HEIF to JPEG...');
        toast({
          title: "Converting Image",
          description: "Converting HEIC format to JPEG...",
        });

        const heic2any = (await import('heic2any')).default;
        processedFile = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8
        }) as Blob;
        
        console.log('HEIC conversion successful');
      }

      // Normalize image size and quality
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate dimensions (max 1920px on longest side)
        const maxSize = 1920;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataURL = canvas.toDataURL('image/jpeg', 0.8);
          setSelectedImage(dataURL);
          setScanResult(null);
          console.log('Image processed successfully:', width, 'x', height);
        }
      };

      img.onerror = () => {
        console.error('Failed to load image for processing');
        toast({
          title: "Upload Failed",
          description: "Failed to process the selected image. Please try a different image.",
          variant: "destructive"
        });
      };

      img.src = URL.createObjectURL(processedFile);

    } catch (error) {
      console.error('Error processing uploaded file:', error);
      toast({
        title: "Upload Failed", 
        description: error instanceof Error ? error.message : "Failed to process the uploaded image.",
        variant: "destructive"
      });
    } finally {
      // Reset file input so same file can be selected again
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const startCamera = async () => {
    try {
      // Stop any existing streams first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      setCameraError(null);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Fallback for older browsers or restricted environments
        if (fileInputRef.current) {
          fileInputRef.current.setAttribute('capture', 'environment');
          fileInputRef.current.click();
          return;
        }
        toast({
          title: "Camera Not Supported",
          description: "Your browser doesn't support camera access. Please upload an image instead.",
          variant: "destructive"
        });
        return;
      }

      // Enhanced constraints for better compatibility
      const constraints = [
        { 
          video: { 
            facingMode: 'environment', 
            width: { min: 640, ideal: 1280, max: 1920 }, 
            height: { min: 480, ideal: 720, max: 1080 },
            frameRate: { ideal: 30, max: 60 }
          } 
        },
        { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } },
        { video: { facingMode: 'environment' } },
        { video: { width: { ideal: 1280 }, height: { ideal: 720 } } },
        { video: { width: { min: 640 }, height: { min: 480 } } },
        { video: true }
      ];

      let mediaStream = null;
      let lastError = null;

      console.log('Attempting to access camera...');
      
      for (let i = 0; i < constraints.length; i++) {
        const constraint = constraints[i];
        try {
          console.log(`Trying constraint ${i + 1}:`, constraint);
          mediaStream = await navigator.mediaDevices.getUserMedia(constraint);
          console.log('Camera access successful with constraint:', constraint);
          break;
        } catch (err: any) {
          lastError = err;
          console.log(`Camera constraint ${i + 1} failed:`, constraint, err.name, err.message);
        }
      }

      if (!mediaStream) {
        console.error('All camera constraints failed. Last error:', lastError);
        throw lastError || new Error('Failed to access camera');
      }

      console.log('Setting up video stream...');
      setStream(mediaStream);
      setIsCameraActive(true);
      setNeedsPlayTrigger(false);
      setIsVideoReady(false);

      // Wait for video ref to be available
      if (videoRef.current) {
        const video = videoRef.current;
        
        // Programmatically set essential attributes for autoplay
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        
        video.srcObject = mediaStream;
        
        // Start the readiness watchdog
        startVideoWatchdog();
        
        // Add event listeners for better debugging
        video.onloadedmetadata = () => {
          console.log('Video metadata loaded, dimensions:', 
            video.videoWidth, 'x', video.videoHeight);
          checkVideoReady();
        };
        
        video.oncanplay = async () => {
          console.log('Video can play');
          checkVideoReady();
          try {
            await video.play();
            console.log('Video playback started successfully');
            setNeedsPlayTrigger(false);
            setCameraError(null);
          } catch (playError) {
            console.error('Video play error:', playError);
            setNeedsPlayTrigger(true);
            setCameraError('Camera preview requires user interaction to start.');
          }
        };
        
        // Additional event to ensure we catch when video dimensions are available
        video.onloadeddata = () => {
          console.log('Video data loaded');
          checkVideoReady();
        };
        
        // Use requestVideoFrameCallback if available
        if ('requestVideoFrameCallback' in video) {
          (video as any).requestVideoFrameCallback(() => {
            setIsVideoReady(true);
            console.log('First video frame received');
          });
        }
        
        // Ensure video plays with proper attributes
        try {
          await video.play();
          console.log('Video playback started successfully');
          setNeedsPlayTrigger(false);
          setCameraError(null);
        } catch (playError) {
          console.error('Video play error:', playError);
          setNeedsPlayTrigger(true);
          setCameraError('Camera preview requires user interaction to start.');
        }
      } else {
        console.error('Video ref not available');
      }
      
    } catch (error: any) {
      console.error('Camera error:', error);
      
      let errorMessage = "Unable to access camera. Please try uploading an image instead.";
      let showFallback = false;
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = "Camera permission denied. Please allow camera access in your browser settings and try again.";
        showFallback = true;
        setPermissionState('denied');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = "No camera found on this device. Please upload an image instead.";
        showFallback = true;
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = "Camera is being used by another application. Please close other apps and try again.";
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        errorMessage = "Camera settings not supported on this device. Please upload an image instead.";
        showFallback = true;
      }
      
      setCameraError(`${error.name}: ${error.message}`);
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      // If fallback needed, trigger file input after a brief delay
      if (showFallback) {
        setTimeout(() => {
          fileInputRef.current?.click();
        }, 2000);
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) {
      console.error('Video ref not available for capture');
      toast({
        title: "Capture Failed",
        description: "Camera is not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      console.error('Video dimensions are zero - cannot capture');
      toast({
        title: "Capture Failed", 
        description: "Camera preview is not ready yet. Please wait and try again.",
        variant: "destructive"
      });
      return;
    }

    console.log('Capturing photo with dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataURL = canvas.toDataURL('image/jpeg');
      
      // Verify the captured image isn't empty (basic check)
      if (dataURL === 'data:image/jpeg;base64,') {
        console.error('Captured empty image');
        toast({
          title: "Capture Failed",
          description: "Failed to capture image. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedImage(dataURL);
      stopCamera();
      setScanResult(null);
      console.log('Photo captured successfully');
    } else {
      console.error('Failed to get canvas context');
      toast({
        title: "Capture Failed",
        description: "Failed to process camera image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePlayTrigger = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setNeedsPlayTrigger(false);
        setCameraError(null);
        startVideoWatchdog(); // Restart watchdog after user interaction
        console.log('Video playbook started after user interaction');
      } catch (error) {
        console.error('Failed to start video after user trigger:', error);
        setCameraError('Failed to start camera preview');
      }
    }
  };

  const openInNewTab = () => {
    window.open('/scan', '_blank');
  };

  const stopCamera = () => {
    if (watchdogTimeout) {
      clearTimeout(watchdogTimeout);
      setWatchdogTimeout(null);
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setNeedsPlayTrigger(false);
    setIsVideoReady(false);
    setCameraError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Clothing Scanner</h1>
              <p className="text-muted-foreground">Get instant condition assessment and value estimation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Iframe Detection Banner */}
        {isInIframe && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Camera works better in a new tab</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Your browser may restrict camera access in embedded views</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={openInNewTab} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Open in new tab
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Permission Status */}
        {permissionState === 'denied' && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">Camera permission denied</p>
                  <p className="text-sm text-red-700 dark:text-red-300">Please allow camera access in your browser settings and refresh the page</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Camera Error Display */}
        {cameraError && isCameraActive && (
          <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-200">Camera Issue</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">{cameraError}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scanning Tips */}
        {!selectedImage && !isCameraActive && <ScanningTips />}

        {/* Upload/Camera Section */}
        {!selectedImage && !isCameraActive && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Photo</h3>
                <p className="text-muted-foreground">Choose an image from your device</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={startCamera}>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Take Photo</h3>
                <p className="text-muted-foreground">Use your camera to scan clothes</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Camera View */}
        {isCameraActive && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <AspectRatio ratio={4/3}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-lg bg-muted"
                  />
                  {needsPlayTrigger && (
                    <div 
                      className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg cursor-pointer"
                      onClick={handlePlayTrigger}
                    >
                      <div className="text-center text-white">
                        <Camera className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-lg font-semibold">Tap to start preview</p>
                        <p className="text-sm opacity-75">
                          {cameraError || "Camera requires user interaction"}
                        </p>
                      </div>
                    </div>
                  )}
                  {!isVideoReady && !needsPlayTrigger && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
                      <div className="text-center text-white">
                        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-lg font-semibold">Preparing camera...</p>
                        <p className="text-sm opacity-75">Getting video feed ready</p>
                      </div>
                    </div>
                  )}
                </AspectRatio>
                <div className="flex justify-center gap-4 mt-4">
                  <Button onClick={capturePhoto} size="lg" disabled={needsPlayTrigger || !isVideoReady}>
                    <Camera className="h-5 w-5 mr-2" />
                    {!isVideoReady ? 'Preparing...' : 'Capture'}
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Preview */}
        {selectedImage && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <AspectRatio ratio={4/3}>
                  <img
                    src={selectedImage}
                    alt="Selected clothing item"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </AspectRatio>
                <div className="flex justify-center gap-4 mt-4">
                  {!scanResult && !isScanning && (
                    <Button onClick={performAIScan} size="lg" className="bg-primary hover:bg-primary/90">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Scan with AI
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedImage(null);
                      setScanResult(null);
                    }}
                  >
                    Upload Different Image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scanning Progress */}
        {isScanning && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-2 animate-spin" />
                <h3 className="text-lg font-semibold">AI is analyzing your clothing...</h3>
                <p className="text-muted-foreground">{scanningStep}</p>
              </div>
              <Progress value={scanProgress} className="w-full" />
              <p className="text-center text-sm text-muted-foreground mt-2">
                {scanProgress}% complete
              </p>
            </CardContent>
          </Card>
        )}

        {/* Scan Results */}
        {scanResult && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Assessment Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Condition & Value */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Condition</p>
                    <Badge className={`text-lg px-4 py-2 ${getConditionColor(scanResult.condition)}`}>
                      {scanResult.condition}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {scanResult.confidence.toFixed(1)}% confidence
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Estimated Value</p>
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="h-6 w-6 text-primary" />
                      <span className="text-3xl font-bold text-primary">{scanResult.estimatedValue}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on current market data
                    </p>
                  </div>
                </div>

                {/* Item Details */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Item Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <p className="font-medium">{scanResult.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Brand:</span>
                      <p className="font-medium">{scanResult.brand}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Material:</span>
                      <p className="font-medium">{scanResult.material}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Subcategory:</span>
                      <p className="font-medium">{scanResult.subcategory}</p>
                    </div>
                  </div>
                </div>

                {/* Condition Details */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Detailed Assessment</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fabric Quality:</span>
                      <span>{scanResult.conditionDetails.fabricQuality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wear Patterns:</span>
                      <span>{scanResult.conditionDetails.wearPatterns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stains:</span>
                      <span>{scanResult.conditionDetails.stains}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overall State:</span>
                      <span>{scanResult.conditionDetails.overallState}</span>
                    </div>
                  </div>
                </div>

                {/* Market Insights */}
                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Market Insights
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Demand Level:</span>
                      <Badge variant={scanResult.marketInsights.demandLevel === 'High' ? 'default' : 'secondary'}>
                        {scanResult.marketInsights.demandLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seasonal Factor:</span>
                      <span>{scanResult.marketInsights.seasonalFactor}</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-muted-foreground text-xs">Price Range:</span>
                      <div className="flex justify-between text-sm font-medium mt-1">
                        <span>Min: ${scanResult.marketInsights.priceRange.min}</span>
                        <span className="text-primary">Optimal: ${scanResult.marketInsights.priceRange.optimal}</span>
                        <span>Max: ${scanResult.marketInsights.priceRange.max}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Suggestions */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Suggestions to Maximize Value
                  </h4>
                  <ul className="space-y-3">
                    {scanResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => {
                      setSelectedImage(null);
                      setScanResult(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Scan Another Item
                  </Button>
                  <Button 
                    onClick={() => toast({
                      title: "Coming Soon!",
                      description: "Save scan results feature will be available soon."
                    })}
                    variant="default"
                    className="flex-1"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Save Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ScanClothes;