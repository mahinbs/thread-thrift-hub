import { useState } from 'react';
import { Camera, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AIScanner = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isScanning] = useState(false);

  const handleScanClick = () => {
    navigate('/scan');
  };

  const handleUploadClick = () => {
    navigate('/scan');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Instant Clothing Assessment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scan your clothes with AI to get instant condition assessment and estimated resale value. 
            Perfect for Gen Z sellers who want quick, accurate pricing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Camera Scan */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={handleScanClick}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Scan with Camera</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Point your camera at any clothing item and get instant AI analysis
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Condition Assessment
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Value Estimation
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  Selling Tips
                </div>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 group-hover:scale-105 transition-transform duration-300"
                disabled={isScanning}
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
            </CardContent>
          </Card>

          {/* Upload Photo */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={handleUploadClick}>
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-8 w-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl">Upload Photo</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Already have photos? Upload them for instant AI analysis
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-orange-500 rounded-full" />
                  Batch Processing
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-pink-500 rounded-full" />
                  Brand Recognition
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full" />
                  Market Comparison
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-secondary/50 hover:bg-secondary/10 group-hover:scale-105 transition-transform duration-300"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI Condition Check</h3>
            <p className="text-sm text-muted-foreground">
              Advanced AI analyzes fabric wear, stains, and overall condition
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-lg font-bold text-blue-600">$</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Smart Pricing</h3>
            <p className="text-sm text-muted-foreground">
              Real-time market data provides accurate resale value estimates
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Quick Listing</h3>
            <p className="text-sm text-muted-foreground">
              One-click listing to multiple platforms with optimized descriptions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIScanner;