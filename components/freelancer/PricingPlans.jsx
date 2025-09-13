"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Clock, Star } from 'lucide-react'
import { formatPrice } from '@/lib/platform-utils'

const PricingPlans = ({ freelancer, onSelectPlan }) => {
  if (!freelancer) return null

  // Generate sample plans based on freelancer's hourly rate
  const baseRate = freelancer.hourlyRate || 50
  
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: Math.round(baseRate * 0.8),
      deliveryTime: '5-7 days',
      features: [
        'Basic content creation',
        '1 revision included',
        'Standard quality',
        'Email support'
      ],
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard',
      price: baseRate,
      deliveryTime: '3-5 days',
      features: [
        'Professional content creation',
        '3 revisions included',
        'High quality output',
        'Priority support',
        'Source files included'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: Math.round(baseRate * 1.5),
      deliveryTime: '1-3 days',
      features: [
        'Premium content creation',
        'Unlimited revisions',
        'Premium quality',
        '24/7 priority support',
        'Source files + extras',
        'Rush delivery'
      ],
      popular: false
    }
  ]

  const handleSelectPlan = (plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pricing Plans</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative transition-all duration-200 hover:shadow-lg ${
              plan.popular ? 'ring-2 ring-primary' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(plan.price)}
                </div>
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {plan.deliveryTime}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan)}
              >
                Select Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PricingPlans