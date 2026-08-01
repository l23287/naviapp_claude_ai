import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, BookOpen, Dumbbell, Settings, Plus, Clock, Target } from "lucide-react";

export default function TrainerProUI() {
  const [sport, setSport] = useState("Volleyball");
  const [page, setPage] = useState("plans");
  const [activePlan, setActivePlan] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Beispiel Trainingsplan",
      exercises: [
        { id: 101, name: "Aufwärmen", duration: 5, level: "Anfänger", description: "Locker aufwärmen", goal: "Aktivierung" }
      ],
      exercisesCount: 1,
      duration: "5 Min.",
      description: "Beispielplan zur Anzeige & Timer-Demo",
      target: "Alle",
    },
    {
      id: 2,
      name: "Ganzkörper Fitness-Workout",
      exercises: [],
      exercisesCount: 5,
      duration: "70 Min.",
      description:
        "Komplettes Ganzkörper-Workout für Anfänger bis Fortgeschrittene. Ideal für 2-3x pro Woche.",
      target: "Anfänger bis Fortgeschrittene",
    },
  ]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-64 bg-card/80 border-r border-border p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-xl mb-8 font-display">
            <img src="/trainerzone-logo.png" alt="TrainerZone Logo" className="h-8 w-auto" />
            <span>TrainerPro</span>
          </div>
          <nav className="space-y-2">
            <SidebarItem icon={<BookOpen />} label="Trainingspläne" active={page === "plans"} onClick={() => setPage("plans")} />
            <SidebarItem icon={<Dumbbell />} label="Übungen" active={page === "exercises"} onClick={() => setPage("exercises")} />
            <SidebarItem icon={<Settings />} label="Einstellungen" active={page === "settings"} onClick={() => setPage("settings")} />
            <SidebarItem icon={<Target />} label="Statistiken" active={page === "stats"} onClick={() => setPage("stats")} />
          </nav>
        </div>

      </aside>

      <main className="flex-1 p-10">
        {page === "plans" && (
          <PlansPage
            sport={sport}
            setPage={setPage}
            setActivePlan={setActivePlan}
            plans={plans}
            setPlans={setPlans}
            exercises={exercises}
          />
        )}
        {page === "planDetail" && (
          <PlanDetailPage
            plan={activePlan}
            onBack={() => setPage("plans")}
          />
        )}
        {page === "exercises" && <ExercisesPage exercises={exercises} setExercises={setExercises} sport={sport} />}
        {page === "settings" && <SettingsPage sport={sport} setSport={setSport} />}
        {page === "stats" && <StatsPage plans={plans} exercises={exercises} sport={sport} />}
      </main>
    </div>
  );
}

function PlansPage({ sport, setPage, setActivePlan, plans, setPlans, exercises }) {
  const [open, setOpen] = useState(false);
  const [confirmPlan, setConfirmPlan] = useState(null);
  const [editPlan, setEditPlan] = useState(null);
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl">Trainingspläne</h1>
          <p className="text-muted-foreground">Planen Sie ein strukturiertes {sport} Training</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Neuer Plan
          </Button>
        </div>
      </div>

      <Input placeholder="Trainingspläne durchsuchen..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...plans]
          .sort((a, b) => {
            if (!a.date) return 1;
            if (!b.date) return -1;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          })
          .filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).map((plan) => (
          <Card key={plan.id} className={plan.date && new Date(plan.date) < new Date(new Date().toDateString()) ? "border-red-400 shadow-sm shadow-red-400/40" : ""}>
            <CardContent className="space-y-4">
              <h2 className="text-xl">{plan.name}</h2>
              <div className="flex gap-3 text-sm">
                <span className="flex items-center gap-1 bg-primary-soft text-primary px-3 py-1 rounded-full">👥 {plan.exercisesCount} Übungen</span>
                <span className="flex items-center gap-1 bg-surface-2 text-muted-foreground px-3 py-1 rounded-full">⏱ {plan.duration}</span>
                {plan.date && (
                  <span className="flex items-center gap-1 bg-surface-2 text-muted-foreground px-3 py-1 rounded-full">📅 {plan.date}</span>
                )}
              </div>
              <div className="text-sm">
                <p className="font-medium mb-1">Beschreibung:</p>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <div className="text-sm">
                <p className="font-medium mb-1">Zielgruppe:</p>
                <p className="text-highlight">{plan.target}</p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setActivePlan(plan);
                    setPage("planDetail");
                  }}
                >👁 Anzeigen</Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditPlan(plan);
                    setOpen(true);
                  }}
                >✏️</Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmPlan(plan);
                  }}
                >🗑</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {open && (
        <TrainingPlanModal
          sport={sport}
          exercises={exercises}
          editPlan={editPlan}
          onCreate={(plan) => {
            if (editPlan) {
              setPlans((prev) => prev.map((p) => (p.id === plan.id ? plan : p)));
            } else {
              setPlans((p) => [...p, plan]);
            }
            setEditPlan(null);
          }}
          onClose={() => {
            setEditPlan(null);
            setOpen(false);
          }}
        />
      )}

      {confirmPlan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground border border-border rounded-3xl p-6 w-80 text-center space-y-4">
            <h2 className="text-lg">Löschen ?</h2>
            <div className="flex justify-center gap-4 pt-2">
              <Button variant="outline" onClick={() => setConfirmPlan(null)}>Abbrechen</Button>
              <Button
                variant="ghost"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  setPlans((prev) => prev.filter((p) => p.id !== confirmPlan.id));
                  setConfirmPlan(null);
                }}
              >Löschen</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ExercisesPage({ exercises, setExercises, sport }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmExercise, setConfirmExercise] = useState(null);
  const [editExercise, setEditExercise] = useState(null);

  function addExercise(ex) {
    setExercises((prev) => [...prev, { ...ex, id: Date.now() }]);
  }

  function updateExercise(updated) {
    setExercises((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl">Übungen verwalten</h1>
          <p className="text-muted-foreground">Übersicht Ihrer Übungen</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Neue Übung
        </Button>
      </div>

      <Input
        placeholder="Übungen durchsuchen..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md mb-10"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {exercises
          .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
          .map((ex) => (
            <Card key={ex.id}>
              <CardContent className="space-y-4">
                <h2 className="text-xl">{ex.name}</h2>

                <div className="flex gap-3 text-sm flex-wrap">
                  <span className="flex items-center gap-1 bg-primary-soft text-primary px-3 py-1 rounded-full">🏆 {sport}</span>
                  <span className="flex items-center gap-1 bg-highlight/15 text-highlight px-3 py-1 rounded-full">{ex.level}</span>
                  <span className="flex items-center gap-1 bg-surface-2 text-muted-foreground px-3 py-1 rounded-full">⏱ {ex.duration} Min.</span>
                </div>

                <div className="text-sm">
                  <p className="font-medium mb-1">Beschreibung:</p>
                  <p className="text-muted-foreground">{ex.description}</p>
                </div>

                <div className="text-sm flex items-start gap-2 text-highlight">
                  <Target size={16} className="mt-0.5" />
                  <span>{ex.goal}</span>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditExercise(ex);
                      setOpen(true);
                    }}
                  >✏️</Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setConfirmExercise(ex)}
                  >🗑</Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {open && (
        <ExerciseModal
          sport={sport}
          editExercise={editExercise}
          onClose={() => {
            setEditExercise(null);
            setOpen(false);
          }}
          onSave={(ex) => {
            editExercise ? updateExercise(ex) : addExercise(ex);
          }}
        />
      )}

      {confirmExercise && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground border border-border rounded-3xl p-6 w-80 text-center space-y-4">
            <h2 className="text-lg">Löschen ?</h2>
            <div className="flex justify-center gap-4 pt-2">
              <Button variant="outline" onClick={() => setConfirmExercise(null)}>Abbrechen</Button>
              <Button
                variant="ghost"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  setExercises((prev) => prev.filter((e) => e.id !== confirmExercise.id));
                  setConfirmExercise(null);
                }}
              >Löschen</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ExerciseModal({ onClose, onSave, sport, editExercise = null }) {
  const [name, setName] = useState(editExercise?.name || "");
  const [description, setDescription] = useState(editExercise?.description || "");
  const [goal, setGoal] = useState(editExercise?.goal || "");
  const [duration, setDuration] = useState(editExercise?.duration || 10);
  const [level, setLevel] = useState(editExercise?.level || "Anfänger");

  function handleSave() {
    if (!name) return;
    onSave({
      id: editExercise?.id ?? Date.now(),
      name,
      description,
      goal,
      duration,
      level,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground border border-border w-full max-w-2xl rounded-3xl overflow-hidden">
        <div className="bg-[image:linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg">{editExercise ? "✏️ Übung bearbeiten" : `+ Neue ${sport}-Übung hinzufügen`}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <Input defaultValue={sport} disabled />
          <Input placeholder="Übungsname" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea className="w-full rounded-2xl border border-input bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Kurze Beschreibung der Übung..." value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input placeholder="Ziel der Übung" value={goal} onChange={(e) => setGoal(e.target.value)} />
          <div className="flex gap-4">
            <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
            <select className="w-full rounded-2xl border border-input bg-card p-3 text-sm text-foreground" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option>Anfänger</option>
              <option>Fortgeschritten</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>Abbrechen</Button>
            <Button onClick={handleSave}>{editExercise ? "Änderungen speichern" : "Übung hinzufügen"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrainingPlanModal({ onClose, onCreate, exercises, sport, editPlan = null }) {
  const [name, setName] = useState(editPlan?.name || "");
  const [description, setDescription] = useState(editPlan?.description || "");
  const [target, setTarget] = useState(editPlan?.target || "");
  const [date, setDate] = useState(editPlan?.date || "");
  const [selectedExercises, setSelectedExercises] = useState(
    editPlan ? editPlan.exercises.map((e) => e.id) : []
  );

  function addExercise(id) {
    if (!selectedExercises.includes(id)) {
      setSelectedExercises((prev) => [...prev, id]);
    }
  }

  function removeExercise(id) {
    setSelectedExercises((prev) => prev.filter((e) => e !== id));
  }

  function moveExercise(index, direction) {
    setSelectedExercises((prev) => {
      const arr = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= arr.length) return prev;
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
  }

  function createPlan() {
    if (!name || selectedExercises.length === 0) return;
    const chosen = selectedExercises
      .map((id) => exercises.find((e) => e.id === id))
      .filter(Boolean);

    const newPlan = {
      id: editPlan ? editPlan.id : Date.now(),
      date,
      name,
      description,
      target,
      exercises: chosen,
      exercisesCount: chosen.length,
      duration: `${chosen.reduce((a, b) => a + Number(b.duration), 0)} Min.`,
    };
    onCreate(newPlan);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground border border-border w-full max-w-3xl rounded-3xl overflow-hidden">
        <div className="bg-[image:linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg">
            {editPlan ? "✏️ Trainingsplan bearbeiten" : `+ Neuen ${sport}-Trainingsplan erstellen`}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
        </div>

        <div className="p-6 space-y-5">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Planname" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-2xl border border-input bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Beschreibung" />
          <Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Zielgruppe" />

          <div className="relative">
            {!date && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">Datum</span>
            )}
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="pl-16" />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Ausgewählte Übungen (in Trainingsreihenfolge)</h3>
            <p className="text-sm text-muted-foreground">💡 Ziehen Sie die Übungen, um die Reihenfolge zu ändern</p>

            <div className="border border-border rounded-2xl divide-y divide-border overflow-hidden">
              {selectedExercises.map((id, index) => {
                const ex = exercises.find((e) => e.id === id);
                if (!ex) return null;
                return (
                  <div key={id} className="flex items-center gap-3 p-3">
                    <div className="flex flex-col text-muted-foreground">
                      <button onClick={() => moveExercise(index, -1)} className="hover:text-foreground">↑</button>
                      <button onClick={() => moveExercise(index, 1)} className="hover:text-foreground">↓</button>
                    </div>
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-soft text-primary font-semibold">{index + 1}</span>
                    <span className="flex-1 font-medium">{ex.name}</span>
                    <span className="text-sm text-muted-foreground">{ex.duration} Min.</span>
                    <button className="text-red-400 hover:text-red-300" onClick={() => removeExercise(id)}>✕</button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Verfügbare Übungen hinzufügen</h3>
            <div className="border border-border rounded-2xl divide-y divide-border overflow-hidden">
              {exercises
                .filter((e) => !selectedExercises.includes(e.id))
                .map((ex) => (
                  <button key={ex.id} onClick={() => addExercise(ex.id)} className="w-full text-left p-3 hover:bg-accent">
                    {ex.name} · {ex.duration} Min.
                  </button>
                ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>Abbrechen</Button>
            <Button onClick={createPlan}>
              {editPlan ? "Änderungen speichern" : "Trainingsplan erstellen"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanDetailPage({ plan, onBack }) {
  const [activeExercise, setActiveExercise] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);

  function startExercise(ex) {
    setActiveExercise(ex);
    setTimeLeft(ex.duration * 60);
    setRunning(true);
  }

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      return;
    }
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [running, timeLeft]);

  function format(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>← Zurück</Button>
        <h1 className="text-3xl">{plan?.name}</h1>
      </div>

      <div className="space-y-6 max-w-3xl">
        {plan?.exercises.map((ex, i) => (
          <Card key={ex.id}>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl"><span className="text-primary mr-2">{i + 1}</span>{ex.name}</h2>
                  <div className="flex gap-2 mt-2 text-sm">
                    <span className="px-3 py-1 rounded-full bg-highlight/15 text-highlight">{ex.level}</span>
                    <span className="px-3 py-1 rounded-full bg-surface-2 text-muted-foreground">{ex.duration} Min</span>
                  </div>
                </div>
                <Button variant="accent" onClick={() => startExercise(ex)}>▶ Start</Button>
              </div>

              <p className="text-muted-foreground">{ex.description}</p>
              <p className="text-muted-foreground">🎯 {ex.goal}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeExercise && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground border border-border rounded-3xl p-8 w-80 text-center space-y-4">
            <h2 className="text-xl">{activeExercise.name}</h2>
            <div className="text-5xl font-mono">{format(timeLeft)}</div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Start"}</Button>
              <Button variant="outline" onClick={() => setActiveExercise(null)}>Schließen</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatsPage({ plans, exercises, sport }) {
  const totalPlans = plans.length;
  const totalExercises = exercises.length;
  const avgDuration = plans.length
    ? Math.round(plans.reduce((a, p) => a + parseInt(p.duration), 0) / plans.length)
    : 0;

  const levelCount = exercises.reduce((acc, e) => {
    acc[e.level] = (acc[e.level] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl">📊 Statistiken & Auswertungen</h1>
        <p className="text-muted-foreground">Überblick über Ihre Trainingsdaten</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-primary text-primary-foreground border-transparent"><CardContent><p>Trainingspläne</p><p className="text-3xl font-bold">{totalPlans}</p></CardContent></Card>
        <Card className="bg-highlight text-background border-transparent"><CardContent><p>Anzahl der Übungen</p><p className="text-3xl font-bold">{totalExercises}</p></CardContent></Card>
        <Card className="bg-primary-dark text-primary-foreground border-transparent"><CardContent><p>Ø Trainingsdauer</p><p className="text-3xl font-bold">{avgDuration} Min</p></CardContent></Card>
        <Card className="bg-highlight-dark text-primary-foreground border-transparent"><CardContent><p>Sportart</p><p className="text-2xl font-bold">{sport}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent>
          <h2 className="text-xl mb-4">Übungen nach Schwierigkeitsgrad</h2>
          {Object.entries(levelCount).map(([level, count]) => (
            <div key={level} className="flex justify-between border-b border-border py-2">
              <span>{level}</span>
              <span className="text-muted-foreground">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Meist genutzte Übungen */}
      <Card>
        <CardContent>
          <h2 className="text-xl mb-4">Meist genutzte Übungen</h2>
          {plans.length === 0 && (
            <p className="text-muted-foreground text-sm">Noch keine Daten vorhanden.</p>
          )}
          {plans.length > 0 && (() => {
            const usage = {};
            plans.forEach((p) => {
              p.exercises?.forEach((e) => {
                usage[e.name] = (usage[e.name] || 0) + 1;
              });
            });

            const entries = Object.entries(usage);
            const total = entries.reduce((a, [, c]) => a + c, 0);
            let acc = 0;
            const colors = ["#4a8fde", "#54d4f8", "#818cf8", "#22d3ee", "#1657a3"];

            const gradient = entries
              .map(([, count], i) => {
                const start = (acc / total) * 100;
                acc += count;
                const end = (acc / total) * 100;
                return `${colors[i % colors.length]} ${start}% ${end}%`;
              })
              .join(", ");

            return (
              <div className="flex gap-6 items-center">
                <div
                  className="w-40 h-40 rounded-full"
                  style={{ background: `conic-gradient(${gradient})` }}
                />
                <div className="space-y-2">
                  {entries.map(([name, count], i) => (
                    <div key={name} className="flex items-center gap-2 text-sm">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[i % colors.length] }}
                      />
                      <span className="flex-1">{name}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsPage({ sport, setSport }) {
  const sports = [
    "Fußball","Basketball","Volleyball","Handball","Tennis","Tischtennis","Badminton","Schwimmen",
    "Leichtathletik","Turnen","Hockey","Rugby","Eishockey","Kampfsport","Fitness","Yoga",
    "Pilates","Tanzen","Klettern","Radsport","Triathlon","Golf","Squash","Fechten"
  ];

  const [search, setSearch] = useState("");
  const filtered = sports.filter((s) => s.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl flex items-center gap-2">⚙️ Einstellungen</h1>
        <p className="text-muted-foreground">Passen Sie Ihr Trainerprofil an</p>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-display font-extrabold">🏆 Sportart</div>
          <p className="text-muted-foreground">Wählen Sie die Sportart, die Sie trainieren</p>

          <Input placeholder="z.B. Fußball, Basketball..." value={search} onChange={(e) => setSearch(e.target.value)} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
            {filtered.map((s) => (
              <button
                key={s}
                onClick={() => setSport(s)}
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition border ${sport === s ? "bg-[image:linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))] text-white border-transparent shadow-[0_10px_25px_rgba(74,143,222,0.25)]" : "bg-card border-border text-foreground hover:bg-accent"}`}
              >{s}</button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-2xl cursor-pointer transition ${
        active
          ? "bg-[image:linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))] text-white shadow-[0_10px_25px_rgba(74,143,222,0.25)]"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
