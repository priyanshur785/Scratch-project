"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import BlockEditor from "./BlockEditor"
import Stage from "./Stage"
import SpriteList from "./SpriteList"

const App = () => {
  const [sprites, setSprites] = useState([
    {
      id: 1,
      name: "Cat",
      blocks: [{ text: "Move 10 Steps" }, { text: "Move 10 Steps" }, { text: "Move 10 Steps" }],
      x: 97.316650390625,
      y: 158,
      rotation: 0,
      size: 100,
      speech: "",
      output: "",
      speed: 1,
    },
    {
      id: 2,
      name: "Dog",
      blocks: [{ text: "Move -10 Steps" }, { text: "Move -10 Steps" }, { text: "Move -10 Steps" }],
      x: 251.316650390625,
      y: 158,
      rotation: 0,
      size: 100,
      speech: "",
      output: "",
      speed: 1,
    },
  ])

  const [selectedId, setSelectedId] = useState(1)
  const [currentStep, setCurrentStep] = useState(null)

  const updateBlocksNested = (blocks, path, updater) => {
    if (path.length === 0) return updater(blocks)
    const [index, ...rest] = path
    return blocks.map((block, i) => {
      if (i !== index) return block
      if (!block.children) block.children = []
      return { ...block, children: updateBlocksNested(block.children, rest, updater) }
    })
  }

  const updateSprite = (updater, blockPath = []) => {
    setSprites((sprites) =>
      sprites.map((s) => {
        if (s.id !== selectedId) return s
        if (blockPath.length === 0) {
          return typeof updater === "function" ? updater(s) : { ...s, ...updater }
        } else {
          return {
            ...s,
            blocks: updateBlocksNested(s.blocks, blockPath, (blocks) =>
              typeof updater === "function" ? updater(blocks) : { ...blocks, ...updater },
            ),
          }
        }
      }),
    )
  }

  const delay = (ms, speed = 1) => new Promise((r) => setTimeout(r, ms / speed))

  const execute = async (sprite) => {
    let { x, y, rotation, speech, blocks, speed, name } = sprite

    const runBlocks = async (blockList) => {
      for (const block of blockList) {
        const t = block.text.toLowerCase().trim()

        if (/^move\s+(-?\d+)\s+steps$/.test(t)) {
          const d = +t.match(/^move\s+(-?\d+)\s+steps$/)[1]
          x += d
          setSprites((sprites) =>
            sprites.map((s) => (s.id === sprite.id ? { ...s, x, output: `${name} moves ${d} steps.` } : s)),
          )
          await delay(500, speed)
        } else if (t === "turn right" || t === "turn left") {
          const delta = t === "turn right" ? 15 : -15
          rotation += delta
          setSprites((sprites) =>
            sprites.map((s) =>
              s.id === sprite.id ? { ...s, rotation, output: `${name} turns ${t.split(" ")[1]}.` } : s,
            ),
          )
          await delay(300, speed)
        } else if (t.startsWith("say ")) {
          const msg = block.text.slice(4)
          speech = msg
          setSprites((sprites) =>
            sprites.map((s) => (s.id === sprite.id ? { ...s, speech, output: `${name} says "${msg}".` } : s)),
          )
          await delay(800, speed)
          speech = ""
          setSprites((sprites) => sprites.map((s) => (s.id === sprite.id ? { ...s, speech } : s)))
        } else if (/^wait\s+(\d+)\s+second/.test(t)) {
          const secs = +t.match(/^wait\s+(\d+)\s+second/)[1]
          setSprites((sprites) =>
            sprites.map((s) => (s.id === sprite.id ? { ...s, output: `${name} waits ${secs} seconds.` } : s)),
          )
          await delay(secs * 1000, speed)
        } else if (/^go to x:(-?\d+)\s*y:(-?\d+)$/i.test(t)) {
          const [, newX, newY] = t.match(/^go to x:(-?\d+)\s*y:(-?\d+)$/i)
          x = +newX
          y = +newY
          setSprites((sprites) =>
            sprites.map((s) => (s.id === sprite.id ? { ...s, x, y, output: `${name} goes to (${x}, ${y})` } : s)),
          )
          await delay(300, speed)
        } else if (t === "go to random position") {
          x = Math.floor(Math.random() * 400)
          y = Math.floor(Math.random() * 300)
          setSprites((sprites) =>
            sprites.map((s) => (s.id === sprite.id ? { ...s, x, y, output: `${name} jumps to random position` } : s)),
          )
          await delay(300, speed)
        } else if (/^glide\s+(\d+)\s+sec\s+to\s+x:(-?\d+)\s*y:(-?\d+)$/i.test(t)) {
          const [, secs, destX, destY] = t.match(/^glide\s+(\d+)\s+sec\s+to\s+x:(-?\d+)\s*y:(-?\d+)$/i)
          x = +destX
          y = +destY
          setSprites((sprites) =>
            sprites.map((s) => (s.id === sprite.id ? { ...s, x, y, output: `${name} glides to (${x}, ${y})` } : s)),
          )
          await delay(+secs * 1000, speed)
        } else if (/^change x by (-?\d+)$/i.test(t)) {
          const [, dx] = t.match(/^change x by (-?\d+)$/i)
          x += +dx
          setSprites((sprites) =>
            sprites.map((s) => (s.id === sprite.id ? { ...s, x, output: `${name} changes X by ${dx}` } : s)),
          )
          await delay(200, speed)
        } else if (/^change y by (-?\d+)$/i.test(t)) {
          const [, dy] = t.match(/^change y by (-?\d+)$/i)
          y += +dy
          setSprites((sprites) =>
            sprites.map((s) => (s.id === sprite.id ? { ...s, y, output: `${name} changes Y by ${dy}` } : s)),
          )
          await delay(200, speed)
        } else if (/^set x to (-?\d+)$/i.test(t)) {
          const [, newX] = t.match(/^set x to (-?\d+)$/i)
          x = +newX
          setSprites((sprites) =>
            sprites.map((s) => (s.id === sprite.id ? { ...s, x, output: `${name} sets X to ${x}` } : s)),
          )
          await delay(200, speed)
        } else if (/^set y to (-?\d+)$/i.test(t)) {
          const [, newY] = t.match(/^set y to (-?\d+)$/i)
          y = +newY
          setSprites((sprites) =>
            sprites.map((s) => (s.id === sprite.id ? { ...s, y, output: `${name} sets Y to ${y}` } : s)),
          )
          await delay(200, speed)
        } else if (t === "if on edge, bounce") {
          if (x < 0 || x > 500) rotation = 180 - rotation
          if (y < 0 || y > 400) rotation = -rotation
          setSprites((sprites) =>
            sprites.map((s) => (s.id === sprite.id ? { ...s, rotation, output: `${name} bounces off edge` } : s)),
          )
          await delay(200, speed)
        } else if (/^point in direction (\d+)$/i.test(t)) {
          const [, dir] = t.match(/^point in direction (\d+)$/i)
          rotation = +dir
          setSprites((sprites) =>
            sprites.map((s) =>
              s.id === sprite.id ? { ...s, rotation, output: `${name} points in direction ${dir}` } : s,
            ),
          )
          await delay(200, speed)
        } else if (/^repeat\s+(\d+)\s+times$/.test(t) && block.children) {
          const count = +t.match(/^repeat\s+(\d+)\s+times$/)[1]
          for (let i = 0; i < count; i++) {
            await runBlocks(block.children)
          }
        }

        await delay(200, speed)
      }
    }

    await runBlocks(blocks)

    setSprites((sprites) => sprites.map((s) => (s.id === sprite.id ? { ...s, output: "" } : s)))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      for (let i = 0; i < sprites.length; i++) {
        for (let j = i + 1; j < sprites.length; j++) {
          const a = sprites[i]
          const b = sprites[j]

          const collides = a.x < b.x + b.size && a.x + a.size > b.x && a.y < b.y + b.size && a.y + a.size > b.y

          if (collides && ((a.name === "Cat" && b.name === "Dog") || (a.name === "Dog" && b.name === "Cat"))) {
            console.log(`Hero Event: ${a.name} and ${b.name} collided!`)

            const aBlocks = [...a.blocks]
            const bBlocks = [...b.blocks]

            setSprites((prev) =>
              prev.map((sprite) => {
                if (sprite.id === a.id) return { ...sprite, blocks: bBlocks }
                if (sprite.id === b.id) return { ...sprite, blocks: aBlocks }
                return sprite
              }),
            )

            setTimeout(() => {
              execute({ ...a, blocks: bBlocks })
              execute({ ...b, blocks: aBlocks })
            }, 0)

            return
          }
        }
      }
    }, 500)

    return () => clearInterval(interval)
  }, [sprites])

  const handleRunAll = () => sprites.forEach(execute)

  const handleSelectSprite = (id) => {
    setSelectedId(id)
    setCurrentStep(null)
  }

  const handleAddSprite = () => {
    const newId = Math.max(0, ...sprites.map((s) => s.id)) + 1

    // Determine sprite type based on existing sprites
    let spriteName = "Sprite"
    const existingNames = sprites.map((s) => s.name.toLowerCase())

    if (!existingNames.includes("cat")) spriteName = "Cat"
    else if (!existingNames.includes("dog")) spriteName = "Dog"
    else if (!existingNames.includes("bird")) spriteName = "Bird"
    else if (!existingNames.includes("alien")) spriteName = "Alien"
    else if (!existingNames.includes("car")) spriteName = "Car"
    else if (!existingNames.includes("ball")) spriteName = "Ball"
    else spriteName = `Sprite ${newId}`

    const newSprite = {
      id: newId,
      name: spriteName,
      blocks: [],
      x: 100 + newId * 50,
      y: 100,
      rotation: 0,
      size: 100,
      speech: "",
      output: "",
      speed: 1,
    }
    setSprites([...sprites, newSprite])
    setSelectedId(newId)
    setCurrentStep(null)
  }

  const handleRemoveSprite = (id) => {
    setSprites((prev) => prev.filter((s) => s.id !== id))
    if (selectedId === id) {
      const remaining = sprites.filter((s) => s.id !== id)
      setSelectedId(remaining.length ? remaining[0].id : null)
    }
  }

  useEffect(() => {
    const handleUpdate = (e) => {
      const { id, x, y } = e.detail
      setSprites((s) => s.map((sprite) => (sprite.id === id ? { ...sprite, x, y } : sprite)))
    }
    window.addEventListener("update-sprite-position", handleUpdate)
    return () => window.removeEventListener("update-sprite-position", handleUpdate)
  }, [])

  const activeSprite = sprites.find((s) => s.id === selectedId)

  return (
    <div className="app-container">
      <Sidebar />
      <BlockEditor
        activeSprite={activeSprite}
        updateSprite={updateSprite}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onRunAll={handleRunAll}
      />
      <Stage sprites={sprites} selectedId={selectedId} />
      <SpriteList
        sprites={sprites}
        selectedId={selectedId}
        onSelect={handleSelectSprite}
        onAdd={handleAddSprite}
        onRemove={handleRemoveSprite}
      />

      <style jsx>{`
        .app-container {
          display: flex;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
    </div>
  )
}

export default App
