import { Button } from '@/view/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/view/components/ui/card'
import { Input } from '@/view/components/ui/input'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 bg-black">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>LucraFood</CardTitle>
            <CardDescription>
              Seu dashboard de controle de custos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Counter Section */}
            <div className="bg-slate-100 rounded-lg p-6 text-center">
              <p className="text-slate-600 text-sm mb-2">Contador</p>
              <p className="text-4xl font-bold text-slate-900">{count}</p>
            </div>

            {/* Input Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ">Nome</label>
              <Input
                type="text"
                placeholder="Digite seu nome..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => setCount((count) => count + 1)}
                className="flex-1"
                variant="default"
              >
                Incrementar
              </Button>
              <Button
                onClick={() => setCount(0)}
                className="flex-1"
                variant="outline"
              >
                Resetar
              </Button>
            </div>

            {/* Info Card */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-slate-600">
                ✨ Stack: React + TypeScript + Tailwind + shadcn/ui
              </p>
              {name && (
                <p className="text-sm text-blue-600 mt-2 font-semibold">
                  Bem-vindo, {name}!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-600 text-center">
              Componentes shadcn/ui com alias @ configurado ✓
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
