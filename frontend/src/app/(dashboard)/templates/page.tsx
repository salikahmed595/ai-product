import { Sparkles, ArrowRight, User } from "lucide-react";

export default function Templates() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Agent Templates</h1>
        <p className="text-muted-foreground mt-1">Select a pre-configured AI persona for your clinic.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TemplateCard 
          name="Aesthetic Clinic Pro" 
          description="A professional, polite, and efficient receptionist designed specifically for medical spas and aesthetic clinics. Excellent at upselling services."
          tags={['Professional', 'Friendly', 'Upselling']}
          recommended
        />
        <TemplateCard 
          name="Dermatology Assistant" 
          description="Focused strictly on medical dermatology. Very precise, asks specific qualification questions before booking."
          tags={['Precise', 'Medical', 'Strict']}
        />
        <TemplateCard 
          name="Luxury MedSpa" 
          description="A warm, luxurious persona that emphasizes comfort, pampering, and high-end experiences."
          tags={['Warm', 'Luxurious', 'Patient']}
        />
      </div>
    </div>
  );
}

function TemplateCard({ name, description, tags, recommended = false }: any) {
  return (
    <div className={`bg-surface p-6 rounded-2xl border flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative ${
      recommended ? 'border-primary shadow-primary/10' : 'border-border'
    }`}>
      {recommended && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-md">
          <Sparkles size={12} className="mr-1" /> Recommended
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${recommended ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
          <User size={24} />
        </div>
        <h3 className="font-semibold text-lg text-foreground">{name}</h3>
      </div>
      <p className="text-muted-foreground text-sm flex-1">{description}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag: string) => (
          <span key={tag} className="bg-muted px-2.5 py-1 rounded-md text-xs font-medium text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
      <button className={`mt-4 w-full py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
        recommended ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
      }`}>
        Use Template <ArrowRight size={16} />
      </button>
    </div>
  );
}
