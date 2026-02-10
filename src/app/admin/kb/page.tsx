"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import type { KnowledgeBaseEntry } from "@/lib/types";

const CATEGORIES = [
  { value: "methodology", label: "Methodologie" },
  { value: "objection_handling", label: "Gestion des objections" },
  { value: "closing", label: "Closing" },
  { value: "discovery", label: "Decouverte" },
  { value: "general", label: "General" },
];

export default function KnowledgeBasePage() {
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", category: "general", content: "" });

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    const res = await fetch("/api/kb");
    const data = await res.json();
    setEntries(data);
    setLoading(false);
  }

  async function handleSave() {
    if (editing) {
      await fetch("/api/kb", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form }),
      });
    } else {
      await fetch("/api/kb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setEditing(null);
    setCreating(false);
    setForm({ title: "", category: "general", content: "" });
    loadEntries();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette entree ?")) return;
    await fetch(`/api/kb?id=${id}`, { method: "DELETE" });
    loadEntries();
  }

  function startEdit(entry: KnowledgeBaseEntry) {
    setEditing(entry.id);
    setCreating(false);
    setForm({ title: entry.title, category: entry.category, content: entry.content });
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm({ title: "", category: "general", content: "" });
  }

  function cancelEdit() {
    setEditing(null);
    setCreating(false);
    setForm({ title: "", category: "general", content: "" });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Base de connaissance</h1>
          <p className="text-muted-foreground mt-1">
            Gerez le contenu pedagogique utilise dans les simulations.
          </p>
        </div>
        <Button onClick={startCreate} disabled={creating}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {/* Create/Edit form */}
      {(creating || editing) && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">
              {editing ? "Modifier l'entree" : "Nouvelle entree"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Titre</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Titre de l'entree"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categorie</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contenu (Markdown)</label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Contenu en markdown..."
                rows={10}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entries list */}
      <div className="space-y-3">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{entry.title}</h3>
                    <Badge variant="secondary">
                      {CATEGORIES.find((c) => c.value === entry.category)?.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {entry.content.substring(0, 200)}...
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(entry)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
