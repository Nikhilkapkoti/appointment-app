"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Target, Zap, TrendingUp, Clock, DollarSign, Users, Settings, Play, Pause, RotateCcw } from "lucide-react"

interface OptimizationRule {
  id: string
  name: string
  description: string
  enabled: boolean
  priority: number
  category: "utilization" | "revenue" | "satisfaction"
  impact: "high" | "medium" | "low"
}

interface OptimizationSettings {
  targetUtilization: number
  maxDailyHours: number
  minBreakTime: number
  enableAutoOptimization: boolean
  optimizationFrequency: "daily" | "weekly" | "monthly"
}

const defaultRules: OptimizationRule[] = [
  {
    id: "peak-hours",
    name: "Peak Hours Optimization",
    description: "Automatically add slots during high-demand periods",
    enabled: true,
    priority: 1,
    category: "utilization",
    impact: "high",
  },
  {
    id: "low-demand-reduction",
    name: "Low Demand Slot Reduction",
    description: "Reduce slots during consistently low-demand periods",
    enabled: true,
    priority: 2,
    category: "utilization",
    impact: "medium",
  },
  {
    id: "revenue-maximization",
    name: "Revenue Maximization",
    description: "Prioritize high-value appointment types",
    enabled: false,
    priority: 3,
    category: "revenue",
    impact: "high",
  },
  {
    id: "patient-satisfaction",
    name: "Patient Satisfaction Focus",
    description: "Optimize for shorter wait times and preferred time slots",
    enabled: true,
    priority: 4,
    category: "satisfaction",
    impact: "medium",
  },
  {
    id: "doctor-workload",
    name: "Doctor Workload Balance",
    description: "Distribute appointments evenly across doctors",
    enabled: true,
    priority: 5,
    category: "satisfaction",
    impact: "low",
  },
]

export function OptimizationEngine() {
  const [rules, setRules] = useState<OptimizationRule[]>(defaultRules)
  const [settings, setSettings] = useState<OptimizationSettings>({
    targetUtilization: 80,
    maxDailyHours: 8,
    minBreakTime: 30,
    enableAutoOptimization: false,
    optimizationFrequency: "weekly",
  })
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [lastOptimization, setLastOptimization] = useState<Date | null>(null)

  const toggleRule = (ruleId: string) => {
    setRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const updateRulePriority = (ruleId: string, priority: number) => {
    setRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, priority } : rule)))
  }

  const runOptimization = async () => {
    setIsOptimizing(true)
    // Simulate optimization process
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsOptimizing(false)
    setLastOptimization(new Date())
  }

  const resetToDefaults = () => {
    setRules(defaultRules)
    setSettings({
      targetUtilization: 80,
      maxDailyHours: 8,
      minBreakTime: 30,
      enableAutoOptimization: false,
      optimizationFrequency: "weekly",
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "utilization":
        return <Target className="h-4 w-4" />
      case "revenue":
        return <DollarSign className="h-4 w-4" />
      case "satisfaction":
        return <Users className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "utilization":
        return "bg-blue-100 text-blue-800"
      case "revenue":
        return "bg-green-100 text-green-800"
      case "satisfaction":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "border-red-500 text-red-700"
      case "medium":
        return "border-yellow-500 text-yellow-700"
      case "low":
        return "border-green-500 text-green-700"
      default:
        return "border-gray-500 text-gray-700"
    }
  }

  const enabledRules = rules.filter((rule) => rule.enabled)
  const optimizationScore = Math.round((enabledRules.length / rules.length) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Optimization Engine</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Automatically optimize schedules based on demand patterns and performance metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={runOptimization} disabled={isOptimizing}>
            {isOptimizing ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Optimizing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Optimization
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{optimizationScore}%</p>
                <p className="text-sm text-muted-foreground">Optimization Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{enabledRules.length}</p>
                <p className="text-sm text-muted-foreground">Active Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{lastOptimization ? "2h ago" : "Never"}</p>
                <p className="text-sm text-muted-foreground">Last Run</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">+15%</p>
                <p className="text-sm text-muted-foreground">Est. Revenue Impact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Progress */}
      {isOptimizing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Optimization in Progress</span>
                <span className="text-sm text-muted-foreground">Analyzing patterns...</span>
              </div>
              <Progress value={66} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Processing utilization data and generating recommendations...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Optimization Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Target Utilization Rate</Label>
                <div className="mt-2">
                  <Slider
                    value={[settings.targetUtilization]}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, targetUtilization: value[0] }))}
                    max={100}
                    min={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>50%</span>
                    <span className="font-medium">{settings.targetUtilization}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Maximum Daily Hours</Label>
                <div className="mt-2">
                  <Slider
                    value={[settings.maxDailyHours]}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, maxDailyHours: value[0] }))}
                    max={12}
                    min={4}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>4h</span>
                    <span className="font-medium">{settings.maxDailyHours}h</span>
                    <span>12h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Minimum Break Time (minutes)</Label>
                <div className="mt-2">
                  <Slider
                    value={[settings.minBreakTime]}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, minBreakTime: value[0] }))}
                    max={60}
                    min={15}
                    step={15}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>15min</span>
                    <span className="font-medium">{settings.minBreakTime}min</span>
                    <span>60min</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-optimization"
                  checked={settings.enableAutoOptimization}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableAutoOptimization: checked }))}
                />
                <Label htmlFor="auto-optimization" className="text-sm">
                  Enable Automatic Optimization
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(rule.category)}
                        <h4 className="font-medium">{rule.name}</h4>
                      </div>
                      <Badge className={getCategoryColor(rule.category)}>{rule.category}</Badge>
                      <Badge variant="outline" className={getImpactColor(rule.impact)}>
                        {rule.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">{rule.description}</p>

                    {rule.enabled && (
                      <div className="ml-8">
                        <Label className="text-xs text-muted-foreground">Priority</Label>
                        <Slider
                          value={[rule.priority]}
                          onValueChange={(value) => updateRulePriority(rule.id, value[0])}
                          max={10}
                          min={1}
                          step={1}
                          className="w-32 mt-1"
                        />
                      </div>
                    )}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{rule.name}</DialogTitle>
                        <DialogDescription>{rule.description}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Rule Configuration</Label>
                          <p className="text-sm text-muted-foreground">
                            Advanced settings for this optimization rule would be configured here.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
