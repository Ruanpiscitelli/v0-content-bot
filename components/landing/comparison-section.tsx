import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ComparisonSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Before vs. After Virallyzer</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See the real transformation in content and results from our creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 border">
            <div className="text-xl font-bold mb-4 text-gray-700">BEFORE</div>
            <div className="mb-6 italic text-gray-600 border-l-4 border-gray-300 pl-4 py-2">
              "Hey everyone, check out my new content on my profile, link in bio if you want to see it"
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-red-500 mt-1">✕</span>
                <span>Conversion rate: 2%</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-red-500 mt-1">✕</span>
                <span>Engagement: 5 comments</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-red-500 mt-1">✕</span>
                <span>Creation time: 45 min</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 border border-primary shadow-md relative">
            <div className="absolute -top-3 -right-3 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Generated
            </div>
            <div className="text-xl font-bold mb-4 text-primary">AFTER</div>
            <div className="mb-6 italic text-gray-800 border-l-4 border-primary pl-4 py-2">
              "I just posted that video you asked for... you know, the one that makes you lose control? It's waiting for
              you, but only for today..."
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Conversion rate: 8.7%</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Engagement: 38 comments</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Creation time: 5 min</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Transform Your Content Now
          </Button>
        </div>
      </div>
    </section>
  )
}
