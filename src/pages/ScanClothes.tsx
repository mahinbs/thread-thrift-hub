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
  const [savedScans, setSavedScans] = useState<Array<ScanResult & { id: string; image: string; savedAt: Date }>>([]);
  const [showSavedScans, setShowSavedScans] = useState(false);

  // Load saved scans from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedScans');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert savedAt back to Date objects
        const scansWithDates = parsed.map((scan: any) => ({
          ...scan,
          savedAt: new Date(scan.savedAt)
        }));
        setSavedScans(scansWithDates);
      } catch (error) {
        console.error('Error loading saved scans:', error);
      }
    }
  }, []);

  // Save scans to localStorage whenever savedScans changes
  useEffect(() => {
    localStorage.setItem('savedScans', JSON.stringify(savedScans));
  }, [savedScans]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'Good': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'Fair': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'Poor': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-muted';
    }
  };

  const saveScanResult = () => {
    if (!scanResult || !selectedImage) return;
    
    const newScan = {
      ...scanResult,
      id: Date.now().toString(),
      image: selectedImage,
      savedAt: new Date()
    };
    
    setSavedScans(prev => [newScan, ...prev]);
    
    toast({
      title: "Scan Saved! 📸",
      description: "Your scan result has been saved successfully.",
    });
  };

  const deleteSavedScan = (id: string) => {
    setSavedScans(prev => prev.filter(scan => scan.id !== id));
    
    toast({
      title: "Scan Deleted",
      description: "The saved scan has been removed.",
    });
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
      console.log('Starting camera...');
      
      // Stop any existing streams first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      setCameraError(null);
      setIsCameraActive(true);
      setIsVideoReady(false);
      setNeedsPlayTrigger(false);
      
      // Check if we're on HTTPS or localhost (required for camera access)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        toast({
          title: "HTTPS Required",
          description: "Camera access requires HTTPS. Please use the upload option instead.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "Camera Not Supported",
          description: "Your browser doesn't support camera access. Please upload an image instead.",
          variant: "destructive"
        });
        return;
      }

      // Request camera permission first
      try {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        console.log('Camera permission state:', permission.state);
        if (permission.state === 'denied') {
          setPermissionState('denied');
          toast({
            title: "Camera Permission Denied",
            description: "Please allow camera access in your browser settings and refresh the page.",
            variant: "destructive"
          });
          return;
        }
      } catch (permError) {
        console.log('Permission API not available, proceeding with camera access');
      }

      // Very basic constraints for maximum compatibility
      const constraints = {
        video: true
      };

      console.log('Requesting camera access with constraints:', constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Camera access successful, stream tracks:', mediaStream.getTracks().map(t => ({ kind: t.kind, label: t.label })));
      setStream(mediaStream);

              // Set up video element
        if (videoRef.current) {
          const video = videoRef.current;
          
          console.log('Setting up video element...');
          
          // Essential video attributes
          video.muted = true;
          video.playsInline = true;
          video.autoplay = true;
          
          // Set the stream as source
          video.srcObject = mediaStream;
          
          // Force video to load and play immediately
          video.load();
          
          // Try to play immediately
          try {
            await video.play();
            console.log('Video playback started immediately');
            setIsVideoReady(true);
            setNeedsPlayTrigger(false);
            setCameraError(null);
          } catch (playError) {
            console.log('Immediate play failed, will need user interaction:', playError);
            setNeedsPlayTrigger(true);
            setCameraError('Tap to start camera preview');
          }
          
          // Event listeners with better error handling
          video.onloadedmetadata = () => {
            console.log('Video metadata loaded:', video.videoWidth, 'x', video.videoHeight);
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              console.log('Video dimensions are valid, setting ready state immediately');
              setIsVideoReady(true);
              setNeedsPlayTrigger(false);
              setCameraError(null);
              
              // Try to play again if not already playing
              if (video.paused) {
                video.play().catch(err => console.log('Play attempt failed:', err));
              }
            }
          };
          
          video.oncanplay = async () => {
            console.log('Video can play event fired');
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              console.log('Video can play with valid dimensions');
              setIsVideoReady(true);
              setNeedsPlayTrigger(false);
              setCameraError(null);
              
              // Try to play the video
              try {
                await video.play();
                console.log('Video playback started successfully');
                setNeedsPlayTrigger(false);
                setCameraError(null);
              } catch (playError) {
                console.log('Video play failed, will need user interaction:', playError);
                setNeedsPlayTrigger(true);
                setCameraError('Tap to start camera preview');
              }
            }
          };
          
          video.onloadeddata = () => {
            console.log('Video data loaded event fired');
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              console.log('Video data loaded with valid dimensions');
              setIsVideoReady(true);
              setNeedsPlayTrigger(false);
              setCameraError(null);
            }
          };
          
          // Additional event to catch when video actually starts playing
          video.onplay = () => {
            console.log('Video play event fired - video is now playing');
            setIsVideoReady(true);
            setNeedsPlayTrigger(false);
            setCameraError(null);
          };
          
          video.onplaying = () => {
            console.log('Video playing event fired - video is actively playing');
            setIsVideoReady(true);
            setNeedsPlayTrigger(false);
            setCameraError(null);
          };
          
          video.onerror = (error) => {
            console.error('Video error event:', error);
            setCameraError('Video loading error occurred');
          };
          
          video.onstalled = () => {
            console.log('Video stalled event');
          };
          
          video.onwaiting = () => {
            console.log('Video waiting event');
          };
          
          // More aggressive state checking - check immediately and then periodically
          const immediateCheck = () => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              console.log('Immediate check: Video ready, updating state');
              setIsVideoReady(true);
              setNeedsPlayTrigger(false);
              setCameraError(null);
              return true;
            }
            return false;
          };
          
          // Check immediately
          if (immediateCheck()) {
            console.log('Video was ready immediately');
          } else {
            // Set a timeout to check if video loads
            setTimeout(() => {
              if (video.videoWidth === 0 || video.videoHeight === 0) {
                console.log('Video dimensions still zero after timeout, checking stream');
                if (mediaStream && mediaStream.active) {
                  console.log('Stream is active, forcing video check');
                  video.load();
                  
                  // Additional fallback: try to restart the stream
                  setTimeout(() => {
                    if (video.videoWidth === 0 || video.videoHeight === 0) {
                      console.log('Video still not loading, attempting stream restart');
                      stopCamera();
                      setTimeout(() => startCamera(), 500);
                    }
                  }, 3000);
                } else {
                  console.log('Stream is not active');
                  setCameraError('Camera stream is not active');
                }
              }
            }, 1000); // Reduced from 2000ms to 1000ms
          }
          
          // Periodic state check to ensure UI updates - more frequent for better responsiveness
          const stateCheckInterval = setInterval(() => {
            if (video.videoWidth > 0 && video.videoHeight > 0 && !isVideoReady) {
              console.log('Periodic check: Video has dimensions but UI not updated, fixing...');
              setIsVideoReady(true);
              setNeedsPlayTrigger(false);
              setCameraError(null);
              clearInterval(stateCheckInterval);
            }
          }, 200); // Reduced from 500ms to 200ms for faster response
          
          // Clean up interval after 5 seconds (reduced from 10 seconds)
          setTimeout(() => clearInterval(stateCheckInterval), 5000);
        }
      
    } catch (error: any) {
      console.error('Camera error:', error);
      
      let errorMessage = "Unable to access camera. Please try uploading an image instead.";
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = "Camera permission denied. Please allow camera access and try again.";
        setPermissionState('denied');
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No camera found on this device. Please upload an image instead.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Camera is being used by another application. Please close other apps and try again.";
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = "Camera settings not supported. Please upload an image instead.";
      }
      
      setCameraError(errorMessage);
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
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

        {/* Camera Help */}
        {!selectedImage && !isCameraActive && (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">Camera Access</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    When you click "Take Photo", your browser will ask for camera permission. 
                    Allow access to use the camera scanner.
                  </p>
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
                <Camera className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Take Photo</h3>
                <p className="text-muted-foreground">Use your camera to scan clothes</p>
                <div className="mt-2 text-xs text-primary/70">
                  Camera permission required
                </div>
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
                    style={{ transform: 'scaleX(-1)' }} // Mirror the camera view
                    onLoadStart={() => console.log('Video load start')}
                    onLoadedMetadata={() => {
                      console.log('Video loaded metadata');
                      if (videoRef.current && videoRef.current.videoWidth > 0) {
                        setIsVideoReady(true);
                        setNeedsPlayTrigger(false);
                      }
                    }}
                    onCanPlay={() => {
                      console.log('Video can play');
                      if (videoRef.current && videoRef.current.videoWidth > 0) {
                        setIsVideoReady(true);
                        setNeedsPlayTrigger(false);
                      }
                    }}
                    onLoadedData={() => {
                      console.log('Video loaded data');
                      if (videoRef.current && videoRef.current.videoWidth > 0) {
                        setIsVideoReady(true);
                        setNeedsPlayTrigger(false);
                      }
                    }}
                    onPlay={() => {
                      console.log('Video play event');
                      setIsVideoReady(true);
                      setNeedsPlayTrigger(false);
                    }}
                    onPlaying={() => {
                      console.log('Video playing event');
                      setIsVideoReady(true);
                      setNeedsPlayTrigger(false);
                    }}
                    onError={(e) => console.error('Video error:', e)}
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3 text-white border-white hover:bg-white hover:text-black"
                          onClick={() => {
                            console.log('Manual retry clicked');
                            if (videoRef.current && stream) {
                              // Force refresh the video element
                              videoRef.current.srcObject = null;
                              setTimeout(() => {
                                if (videoRef.current && stream) {
                                  videoRef.current.srcObject = stream;
                                  videoRef.current.load();
                                  
                                  // Force state update after a short delay
                                  setTimeout(() => {
                                    if (videoRef.current && videoRef.current.videoWidth > 0) {
                                      console.log('Manual retry: Video ready, updating state');
                                      setIsVideoReady(true);
                                      setNeedsPlayTrigger(false);
                                      setCameraError(null);
                                    }
                                  }, 1000);
                                }
                              }, 100);
                            }
                          }}
                        >
                          Retry
                        </Button>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log('Debug info:');
                      console.log('Video ref:', videoRef.current);
                      console.log('Stream:', stream);
                      console.log('Video ready:', isVideoReady);
                      console.log('Needs play trigger:', needsPlayTrigger);
                      if (videoRef.current) {
                        console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
                        console.log('Video readyState:', videoRef.current.readyState);
                        console.log('Video paused:', videoRef.current.paused);
                      }
                    }}
                  >
                    Debug
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
                    onClick={saveScanResult}
                    variant="default"
                    className="flex-1"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Save Results
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        // Create comprehensive listing template for eBay
                        const title = `${scanResult.brand} ${scanResult.category} - ${scanResult.condition} Condition`;
                        const description = `${scanResult.brand} ${scanResult.subcategory} in ${scanResult.condition.toLowerCase()} condition.

MATERIAL: ${scanResult.material}
CONDITION: ${scanResult.condition} (${scanResult.confidence.toFixed(1)}% confidence)
AI ANALYSIS: ${scanResult.conditionDetails.overallState}

DETAILED ASSESSMENT:
• Fabric Quality: ${scanResult.conditionDetails.fabricQuality}
• Wear Patterns: ${scanResult.conditionDetails.wearPatterns}
• Stains: ${scanResult.conditionDetails.stains}

MARKET INSIGHTS:
• Demand Level: ${scanResult.marketInsights.demandLevel}
• Seasonal Factor: ${scanResult.marketInsights.seasonalFactor}
• Price Range: $${scanResult.marketInsights.priceRange.min} - $${scanResult.marketInsights.priceRange.max}

AI RECOMMENDATIONS:
${scanResult.suggestions.map(suggestion => `• ${suggestion}`).join('\n')}

Estimated Value: $${scanResult.estimatedValue}`;
                        
                        // Copy listing details to clipboard
                        navigator.clipboard.writeText(`Title: ${title}\n\nDescription:\n${description}\n\nPrice: $${scanResult.estimatedValue}\nCondition: ${scanResult.condition}\nCategory: ${scanResult.category}`);
                        
                        // Open eBay listing creation page
                        window.open('https://www.ebay.com/sh/lst/active?action=add', '_blank');
                        
                        toast({
                          title: "eBay Listing Template Copied! 📋",
                          description: "Listing details copied to clipboard. eBay Create Listing page opened in new tab.",
                        });
                      }}
                      variant="outline"
                      className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                    >
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.1 4.8c-.6 0-1.1.2-1.5.6L9.3 12.7l-1.1-1.1c-.4-.4-.9-.6-1.5-.6s-1.1.2-1.5.6c-.4.4-.6.9-.6 1.5s.2 1.1.6 1.5l3.2 3.2c.4.4.9.6 1.5.6s1.1-.2 1.5-.6l8.3-8.3c.4-.4.6-.9.6-1.5s-.2-1.1-.6-1.5c-.4-.4-.9-.6-1.5-.6z"/>
                      </svg>
                      Copy & Open eBay
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        // Show listing details in a modal or expandable section
                        const listingDetails = `Title: ${scanResult.brand} ${scanResult.category} - ${scanResult.condition} Condition

Description:
${scanResult.brand} ${scanResult.subcategory} in ${scanResult.condition.toLowerCase()} condition.

MATERIAL: ${scanResult.material}
CONDITION: ${scanResult.condition} (${scanResult.confidence.toFixed(1)}% confidence)
AI ANALYSIS: ${scanResult.conditionDetails.overallState}

DETAILED ASSESSMENT:
• Fabric Quality: ${scanResult.conditionDetails.fabricQuality}
• Wear Patterns: ${scanResult.conditionDetails.wearPatterns}
• Stains: ${scanResult.conditionDetails.stains}

MARKET INSIGHTS:
• Demand Level: ${scanResult.marketInsights.demandLevel}
• Seasonal Factor: ${scanResult.marketInsights.seasonalFactor}
• Price Range: $${scanResult.marketInsights.priceRange.min} - $${scanResult.marketInsights.priceRange.max}

AI RECOMMENDATIONS:
${scanResult.suggestions.map(suggestion => `• ${suggestion}`).join('\n')}

Price: $${scanResult.estimatedValue}
Condition: ${scanResult.condition}
Category: ${scanResult.category}`;
                        
                        // Copy to clipboard
                        navigator.clipboard.writeText(listingDetails);
                        
                        toast({
                          title: "Listing Details Copied! 📋",
                          description: "All listing information copied to clipboard. Ready to paste into eBay!",
                        });
                      }}
                      variant="ghost"
                      size="sm"
                      className="border-dashed border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
                    >
                      📋 Copy Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Saved Scans Section */}
        {savedScans.length > 0 && (
          <div className="space-y-6 mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Saved Scans</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Open eBay in new tab for bulk listing
                    window.open('https://www.ebay.com/sh/lst/active', '_blank');
                    
                    toast({
                      title: "eBay Seller Hub Opened! 🚀",
                      description: "You can now list multiple items from your saved scans.",
                    });
                  }}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  eBay Seller Hub
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const dataStr = JSON.stringify(savedScans, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `scan-results-${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                    
                    toast({
                      title: "Data Exported! 📊",
                      description: "Your scan results have been downloaded as JSON.",
                    });
                  }}
                >
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSavedScans(!showSavedScans)}
                >
                  {showSavedScans ? 'Hide' : 'Show'} Saved Scans ({savedScans.length})
                </Button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-primary">
                  ${savedScans.reduce((sum, scan) => sum + scan.estimatedValue, 0).toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {savedScans.filter(scan => scan.condition === 'Excellent').length}
                </div>
                <div className="text-sm text-muted-foreground">Excellent Items</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">
                  {savedScans.filter(scan => scan.marketInsights.demandLevel === 'High').length}
                </div>
                <div className="text-sm text-muted-foreground">High Demand</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {savedScans.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Scans</div>
              </Card>
            </div>
            
            {showSavedScans && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedScans.map((savedScan) => (
                  <Card key={savedScan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{savedScan.category}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSavedScan(savedScan.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          ×
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {savedScan.brand} • {savedScan.subcategory}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Image */}
                      <div className="relative">
                        <img
                          src={savedScan.image}
                          alt={savedScan.category}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Badge className={`absolute top-2 right-2 ${getConditionColor(savedScan.condition)}`}>
                          {savedScan.condition}
                        </Badge>
                      </div>
                      
                      {/* Key Info */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Estimated Value:</span>
                          <span className="text-lg font-bold text-primary">
                            ${savedScan.estimatedValue}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Confidence:</span>
                          <span className="text-sm font-medium">
                            {savedScan.confidence.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Material:</span>
                          <span className="text-sm font-medium">{savedScan.material}</span>
                        </div>
                      </div>
                      
                      {/* Market Insights */}
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-muted-foreground">Demand:</span>
                          <Badge variant={savedScan.marketInsights.demandLevel === 'High' ? 'default' : 'secondary'} className="text-xs">
                            {savedScan.marketInsights.demandLevel}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Price Range: ${savedScan.marketInsights.priceRange.min} - ${savedScan.marketInsights.priceRange.max}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs border-orange-500 text-orange-600 hover:bg-orange-50"
                          onClick={() => {
                            // Create comprehensive listing template for eBay
                            const title = `${savedScan.brand} ${savedScan.category} - ${savedScan.condition} Condition`;
                            const description = `${savedScan.brand} ${savedScan.subcategory} in ${savedScan.condition.toLowerCase()} condition.

MATERIAL: ${savedScan.material}
CONDITION: ${savedScan.condition} (${savedScan.confidence.toFixed(1)}% confidence)
AI ANALYSIS: ${savedScan.conditionDetails.overallState}

DETAILED ASSESSMENT:
• Fabric Quality: ${savedScan.conditionDetails.fabricQuality}
• Wear Patterns: ${savedScan.conditionDetails.wearPatterns}
• Stains: ${savedScan.conditionDetails.stains}

MARKET INSIGHTS:
• Demand Level: ${savedScan.marketInsights.demandLevel}
• Seasonal Factor: ${savedScan.marketInsights.seasonalFactor}
• Price Range: $${savedScan.marketInsights.priceRange.min} - $${savedScan.marketInsights.priceRange.max}

AI RECOMMENDATIONS:
${savedScan.suggestions.map(suggestion => `• ${suggestion}`).join('\n')}

Estimated Value: $${savedScan.estimatedValue}`;
                            
                            // Copy listing details to clipboard
                            navigator.clipboard.writeText(`Title: ${title}\n\nDescription:\n${description}\n\nPrice: $${savedScan.estimatedValue}\nCondition: ${savedScan.condition}\nCategory: ${savedScan.category}`);
                            
                            // Open eBay listing creation page
                            window.open('https://www.ebay.com/sh/lst/active?action=add', '_blank');
                            
                            toast({
                              title: "eBay Listing Template Copied! 📋",
                              description: "Listing details copied to clipboard. eBay Create Listing page opened in new tab.",
                            });
                          }}
                        >
                          <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.1 4.8c-.6 0-1.1.2-1.5.6L9.3 12.7l-1.1-1.1c-.4-.4-.9-.6-1.5-.6s-1.1.2-1.5.6c-.4.4-.6.9-.6 1.5s.2 1.1.6 1.5l3.2 3.2c.4.4.9.6 1.5.6s1.1-.2 1.5-.6l8.3-8.3c.4-.4.6-.9.6-1.5s-.2-1.1-.6-1.5c-.4-.4-.9-.6-1.5-.6z"/>
                          </svg>
                          Copy & List
                        </Button>
                      </div>
                      
                      {/* Save Date */}
                      <div className="text-xs text-muted-foreground text-center pt-2">
                        Saved on {savedScan.savedAt.toLocaleDateString()} at {savedScan.savedAt.toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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