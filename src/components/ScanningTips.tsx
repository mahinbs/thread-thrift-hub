import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Camera, Sun, Focus } from 'lucide-react';

const ScanningTips = () => {
  const goodTips = [
    {
      icon: <Sun className="h-4 w-4" />,
      title: "Good Lighting",
      description: "Use natural daylight or bright indoor lighting"
    },
    {
      icon: <Focus className="h-4 w-4" />,
      title: "Clear Focus",
      description: "Ensure the item is in sharp focus and fully visible"
    },
    {
      icon: <Camera className="h-4 w-4" />,
      title: "Full Item View",
      description: "Show the entire garment or accessory in frame"
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      title: "Clean Background",
      description: "Use a plain background to highlight the item"
    }
  ];

  const badExamples = [
    "Blurry or out-of-focus images",
    "Multiple items in one photo", 
    "Very dark or shadowy lighting",
    "Items that aren't clothing or accessories",
    "Photos where the item is too small or far away"
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Camera className="h-5 w-5 text-primary" />
          Tips for Best Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            For Best Results:
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            {goodTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="text-green-600 mt-0.5">{tip.icon}</div>
                <div>
                  <p className="font-medium">{tip.title}</p>
                  <p className="text-muted-foreground text-xs">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Avoid:
          </h4>
          <ul className="space-y-1">
            {badExamples.map((example, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 bg-orange-500 rounded-full" />
                {example}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Supported Items:</strong> Clothing (shirts, dresses, pants, etc.), shoes, bags, 
            jewelry, watches, belts, hats, and other fashion accessories.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanningTips;