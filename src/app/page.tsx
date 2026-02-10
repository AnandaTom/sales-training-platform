import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, BarChart3, BookOpen, Target } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Simulation realiste",
    description:
      "Pratiquez avec des acheteurs IA aux personnalites uniques. Chaque conversation est differente.",
  },
  {
    icon: BarChart3,
    title: "Debrief detaille",
    description:
      "Recevez un coaching automatique apres chaque simulation : score, points forts, axes d'amelioration.",
  },
  {
    icon: BookOpen,
    title: "Base de connaissance",
    description:
      "Les simulations s'appuient sur les methodologies de vente enseignees en seminaire.",
  },
  {
    icon: Target,
    title: "Progression continue",
    description:
      "Suivez votre evolution avec l'historique de vos sessions et vos scores.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-bold text-xl">Sales Training</h1>
          <Link href="/login">
            <Button variant="outline">Se connecter</Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Developpez vos competences en vente par la pratique
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Simulez des conversations de vente avec des acheteurs IA realistes.
              Recevez un coaching personnalise apres chaque session.
              Progressez a votre rythme.
            </p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="text-base px-8">
                  Commencer l&apos;entrainement
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-10">
              Comment ca fonctionne
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <feature.icon className="h-10 w-10 text-primary mb-4" />
                    <h4 className="font-semibold mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-10">
              3 etapes simples
            </h3>
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Choisissez un scenario",
                  desc: "Selectionnez un type d'acheteur et un contexte de vente adapte a votre niveau.",
                },
                {
                  step: "2",
                  title: "Lancez la simulation",
                  desc: "Conversez en temps reel avec un acheteur IA qui reagit naturellement a votre approche.",
                },
                {
                  step: "3",
                  title: "Analysez votre performance",
                  desc: "Recevez un debrief complet avec score, points forts et recommandations concretes.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-primary/5">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold">Pret a vous entrainer ?</h3>
            <p className="text-muted-foreground mt-2">
              Connectez-vous avec les identifiants fournis lors du seminaire.
            </p>
            <Link href="/login">
              <Button size="lg" className="mt-6">
                Acceder a la plateforme
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          Sales Training Platform &middot; Plateforme d&apos;entrainement aux techniques de vente
        </div>
      </footer>
    </div>
  );
}
