import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Check, CheckCircle2, GripVertical, ListChecks, MoreHorizontal, Plus,
  Search, Settings2, Trash2, X
} from 'lucide-react'
import './styles.css'

const starterTasks = [
  {
    id: 'alignment',
    title: 'Wheel alignment',
    category: 'Chassis og styretøj',
    description: 'Indstil hjulvinklerne efter fabrikantens specifikationer for sikker kørsel og ensartet dækslid.',
    time: '45 min.',
    updated: 'I dag',
    steps: [
      { id: 1, text: 'Kontrollér dæktryk og inspicér dækkene for ujævnt slid', done: true, note: 'Indstil alle dæk til værdierne på bilens mærkat.' },
      { id: 2, text: 'Kontrollér styretøj og ophæng for slør eller skader', done: true, note: '' },
      { id: 3, text: 'Montér målehovederne, og kompenser for fælgslaget', done: false, note: '' },
      { id: 4, text: 'Mål camber, caster og sporing på alle hjul', done: false, note: '' },
      { id: 5, text: 'Justér sporingen efter specifikationerne, og kontrollér alle målinger igen', done: false, note: '' },
      { id: 6, text: 'Prøvekør bilen, og kontrollér rattets position', done: false, note: '' }
    ]
  },
  {
    id: 'oil',
    title: 'Engine oil & filter',
    category: 'Motorsservice',
    description: 'Tøm og påfyld motorolie, og udskift oliefilter samt tætningsskive.',
    time: '30 min.',
    updated: 'I går',
    steps: [
      { id: 1, text: 'Varm motoren kort op, og hæv bilen sikkert', done: false, note: '' },
      { id: 2, text: 'Afmontér bundproppen, og lad den gamle olie løbe af', done: false, note: '' },
      { id: 3, text: 'Udskift oliefilteret og bundproppens tætningsskive', done: false, note: '' },
      { id: 4, text: 'Påfyld den korrekte olietype og mængde', done: false, note: '' },
      { id: 5, text: 'Start motoren, kontrollér for lækager, og kontrollér oliestanden', done: false, note: '' }
    ]
  },
  {
    id: 'brakes',
    title: 'Front brake pads',
    category: 'Bremsesystem',
    description: 'Afmontér og udskift de forreste bremseklodser, og kontrollér derefter bremsernes funktion.',
    time: '60 min.',
    updated: '18. sep.',
    steps: [
      { id: 1, text: 'Afmontér hjulet, og inspicér bremseenheden', done: false, note: '' },
      { id: 2, text: 'Mål skivens tykkelse, og kontrollér for riller', done: false, note: '' },
      { id: 3, text: 'Afmontér kaliberen og de gamle bremseklodser', done: false, note: '' },
      { id: 4, text: 'Rengør, smør, og montér de nye klodser', done: false, note: '' },
      { id: 5, text: 'Montér kaliberen igen, og spænd boltene efter specifikationerne', done: false, note: '' },
      { id: 6, text: 'Pump på bremsepedalen, og udfør en test ved lav hastighed', done: false, note: '' }
    ]
  }
]

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('workshop-tasks')) || starterTasks } catch { return starterTasks }
  })
  const [selectedId, setSelectedId] = useState('alignment')
  const [query, setQuery] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', category: 'General' })
  const [editingStep, setEditingStep] = useState(null)

  useEffect(() => localStorage.setItem('workshop-tasks', JSON.stringify(tasks)), [tasks])

  const selected = tasks.find(task => task.id === selectedId) || tasks[0]
  const filteredTasks = useMemo(() => tasks.filter(task => `${task.title} ${task.category}`.toLowerCase().includes(query.toLowerCase())), [tasks, query])
  const completed = selected?.steps.filter(step => step.done).length || 0
  const progress = selected?.steps.length ? Math.round((completed / selected.steps.length) * 100) : 0

  const updateSelected = (change) => setTasks(current => current.map(task => task.id === selected.id ? { ...task, ...change, updated: 'Just now' } : task))
  const toggleStep = id => updateSelected({ steps: selected.steps.map(step => step.id === id ? { ...step, done: !step.done } : step) })
  const resetChecked = () => updateSelected({ steps: selected.steps.map(step => ({ ...step, done: false })) })
  const deleteStep = id => updateSelected({ steps: selected.steps.filter(step => step.id !== id) })
  const addStep = () => updateSelected({ steps: [...selected.steps, { id: makeId(), text: 'New step', done: false, note: '' }] })
  const saveTask = (event) => {
    event.preventDefault()
    if (!newTask.title.trim()) return
    const task = { id: makeId(), title: newTask.title.trim(), category: newTask.category || 'Generelt', description: 'Tilføj en kort beskrivelse af denne arbejdsplan.', time: '—', updated: 'Lige nu', steps: [] }
    setTasks(current => [task, ...current])
    setSelectedId(task.id)
    setNewTask({ title: '', category: 'General' })
    setIsAdding(false)
  }
  const deleteTask = () => {
    if (tasks.length === 1) return
    const remaining = tasks.filter(task => task.id !== selected.id)
    setTasks(remaining)
    setSelectedId(remaining[0].id)
  }

  return (
    <div className="app-shell">
      <main className="layout">
        <aside className="sidebar">
          <div className="sidebar-heading"><div><p className="eyebrow">Dit bibliotek</p><h1>Arbejdsplaner</h1></div><button className="add-button" onClick={() => setIsAdding(true)}><Plus size={17} /> Ny opgave</button></div>
          <div className="search-field"><Search size={17} /><input placeholder="Søg i arbejdsplaner..." value={query} onChange={event => setQuery(event.target.value)} /></div>
          <div className="task-list">
            {filteredTasks.map(task => {
              const taskDone = task.steps.filter(step => step.done).length
              return <button key={task.id} className={selectedId === task.id ? 'task-card selected' : 'task-card'} onClick={() => setSelectedId(task.id)}>
                <div className="task-card-top"><span className="task-category">{task.category}</span><MoreHorizontal size={17} /></div>
                <strong>{task.title}</strong><span className="task-meta">{taskDone}/{task.steps.length} steps · {task.updated}</span>
                <div className="mini-progress"><span style={{ width: `${task.steps.length ? (taskDone / task.steps.length) * 100 : 0}%` }} /></div>
              </button>
            })}
            {filteredTasks.length === 0 && <div className="empty-search">Ingen arbejdsplaner matcher din søgning.</div>}
          </div>
          <div className="sidebar-footer"><button><Settings2 size={17} /> Indstillinger</button><span>v0.1 prototype</span></div>
        </aside>

        <section className="content">
          <div className="content-inner">
            <div className="breadcrumb"><span>Arbejdsplaner</span><span>/</span><strong>{selected.category}</strong></div>
            <div className="hero-row"><div><div className="title-line"><h2>{selected.title}</h2><button className="icon-button subtle" aria-label="Flere muligheder"><MoreHorizontal size={21} /></button></div><p className="description">{selected.description}</p></div><button className="delete-task" onClick={deleteTask}><Trash2 size={16} /> Slet opgave</button></div>
            <div className="progress-card"><div className="progress-info"><div><span className="eyebrow">Arbejdsplanens status</span><strong>{completed} af {selected.steps.length} gennemført</strong></div><span className="progress-percent">{progress}%</span></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
            <div className="steps-header"><div><h3>Trinplan</h3><p>Følg punkterne i rækkefølge. Du kan tilføje noter til hvert trin.</p></div><div className="step-actions"><button className="outline-button" onClick={resetChecked} disabled={completed === 0}><Check size={16} /> Nulstil markerede</button><button className="outline-button" onClick={addStep}><Plus size={17} /> Tilføj trin</button></div></div>
            <div className="steps-list">
              {selected.steps.length === 0 && <div className="empty-steps"><ListChecks size={30} /><strong>Din plan er tom</strong><span>Tilføj det første trin for at opbygge arbejdsplanen.</span><button className="add-button" onClick={addStep}><Plus size={17} /> Tilføj første trin</button></div>}
              {selected.steps.map((step, index) => <div className={step.done ? 'step-row done' : 'step-row'} key={step.id}>
                <div className="drag"><GripVertical size={18} /></div><button className={step.done ? 'check checked' : 'check'} aria-label={`Mark step ${index + 1} ${step.done ? 'incomplete' : 'complete'}`} onClick={() => toggleStep(step.id)}>{step.done && <Check size={14} strokeWidth={3} />}</button><div className="step-body"><div className="step-main"><span className="step-number">{String(index + 1).padStart(2, '0')}</span>{editingStep === step.id ? <input autoFocus className="step-edit" value={step.text} onChange={event => updateSelected({ steps: selected.steps.map(item => item.id === step.id ? { ...item, text: event.target.value } : item) })} onBlur={() => setEditingStep(null)} onKeyDown={event => event.key === 'Enter' && setEditingStep(null)} /> : <button className="step-text" onDoubleClick={() => setEditingStep(step.id)}>{step.text}</button>}<button className="step-delete" onClick={() => deleteStep(step.id)} aria-label="Delete step"><X size={16} /></button></div>{step.note && <div className="step-note">{step.note}</div>}</div>
              </div>)}
            </div>
            <div className="tip"><CheckCircle2 size={18} /><span><strong>Tip:</strong> Dobbeltklik på et trin for at redigere det. Dine arbejdsplaner gemmes automatisk i denne browser.</span></div>
          </div>
        </section>
      </main>
      {isAdding && <div className="modal-backdrop" onMouseDown={() => setIsAdding(false)}><form className="modal" onSubmit={saveTask} onMouseDown={event => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">Ny arbejdsplan</span><h3>Opret en opgave</h3></div><button type="button" className="icon-button" onClick={() => setIsAdding(false)}><X size={19} /></button></div><label>Opgavens navn<input autoFocus value={newTask.title} onChange={event => setNewTask({ ...newTask, title: event.target.value })} placeholder="f.eks. Udskift kobling" /></label><label>Kategori<input value={newTask.category} onChange={event => setNewTask({ ...newTask, category: event.target.value })} placeholder="f.eks. Drivlinje" /></label><div className="modal-actions"><button type="button" className="outline-button" onClick={() => setIsAdding(false)}>Annullér</button><button className="add-button" type="submit">Opret arbejdsplan</button></div></form></div>}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
