import { Section } from "./section"
import { SectionHeader } from "./section-header"
import { Shield, Lock, Eye } from "lucide-react"

export function SecuritySection() {
  return (
    <Section background="primary">
      <SectionHeader
        title="Private. Secure. All Yours."
        subtitle="Your privacy is our priority. All your data and content are protected with the highest security standards."
        withLine
        titleClassName="text-white"
        subtitleClassName="text-white/90"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Virallyzer Doesn't Share Data</h3>
          <p className="text-white/80 text-sm">Your data is never used to train our AI models</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">AI Learns from Text, Not Images</h3>
          <p className="text-white/80 text-sm">Your photos and videos are never processed by AI</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">End-to-End Encryption</h3>
          <p className="text-white/80 text-sm">All communication is encrypted from start to finish</p>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <div className="bg-white/10 text-xs text-white/90 px-4 py-2 rounded-full">
          ISO 27001 Security Certified • GDPR Compliant
        </div>
      </div>
    </Section>
  )
}
