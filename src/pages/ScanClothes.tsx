import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Sparkles, DollarSign, ArrowLeft, TrendingUp, Info, CheckCircle } from 'lucide-react';
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

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'Good': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'Fair': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'Poor': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-muted';
    }
  };

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please try uploading an image instead.",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataURL);
        stopCamera();
        setScanResult(null);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
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
                    className="w-full h-full object-cover rounded-lg"
                  />
                </AspectRatio>
                <div className="flex justify-center gap-4 mt-4">
                  <Button onClick={capturePhoto} size="lg">
                    <Camera className="h-5 w-5 mr-2" />
                    Capture
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