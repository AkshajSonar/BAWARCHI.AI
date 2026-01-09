"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

type Props = {
  title: string
  value: number
  suffix?: string
}

export function AnimatedKpi({ title, value, suffix = "" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border bg-background p-6 shadow-sm"
    >
      <p className="text-sm text-muted-foreground">{title}</p>

      <motion.h2
        className="mt-2 text-3xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Counter to={value} />{suffix}
      </motion.h2>
    </motion.div>
  )
}

function Counter({ to }: { to: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, latest => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, to, {
      duration: 1.2,
      ease: "easeOut",
    })

    return controls.stop
  }, [to, count])

  return <motion.span>{rounded}</motion.span>
}
