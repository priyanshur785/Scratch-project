"use client"

export class BlockExecutor {
  constructor(sprites, setSprites) {
    this.sprites = sprites
    this.setSprites = setSprites
    this.runningSprites = new Set()
    this.shouldStop = false
  }

  async executeSprite(sprite) {
    if (!sprite.blocks || sprite.blocks.length === 0) {
      console.log(`❌ ${sprite.name} has no blocks to execute`)
      return
    }

    console.log(`🎬 Starting execution of ${sprite.name}`)
    this.runningSprites.add(sprite.id)

    // Create a local copy of sprite properties to avoid conflicts
    const spriteState = {
      x: sprite.x,
      y: sprite.y,
      rotation: sprite.rotation,
      speech: sprite.speech,
      size: sprite.size,
      name: sprite.name,
      speed: sprite.speed || 1,
    }

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms / spriteState.speed))

    const updateSprite = (updates) => {
      // Update local state
      Object.assign(spriteState, updates)

      // Update global state - use functional update to avoid race conditions
      this.setSprites((currentSprites) => currentSprites.map((s) => (s.id === sprite.id ? { ...s, ...updates } : s)))
    }

    const executeBlocks = async (blocks) => {
      for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        const block = blocks[blockIndex]

        // Check if we should stop execution
        if (this.shouldStop || !this.runningSprites.has(sprite.id)) {
          console.log(`⏹️ ${spriteState.name} execution stopped at block ${blockIndex}`)
          return
        }

        const blockText = block.text.toLowerCase().trim()
        console.log(`🔄 ${spriteState.name} executing: ${block.text}`)

        // Skip event blocks (they're just triggers)
        if (blockText.includes("when") && blockText.includes("🏁")) {
          console.log(`⏭️ Skipping event block: ${block.text}`)
          continue
        }

        try {
          // Motion blocks
          if (blockText.includes("move") && blockText.includes("steps")) {
            // Match both (10) and $$10$$ patterns
            const match = blockText.match(/$$(\d+)$$/) || blockText.match(/move\s*(\d+)\s*steps/)
            const steps = match ? Number.parseInt(match[1]) || 10 : 10

            const radians = (spriteState.rotation - 90) * (Math.PI / 180)
            spriteState.x += Math.cos(radians) * steps
            spriteState.y += Math.sin(radians) * steps

            updateSprite({
              x: spriteState.x,
              y: spriteState.y,
              output: `${spriteState.name} moved ${steps} steps`,
            })
            await delay(500)
          } else if (blockText.includes("turn") && blockText.includes("degrees")) {
            const match = blockText.match(/$$(\d+)$$/) || blockText.match(/turn.*?(\d+)/)
            const degrees = match ? Number.parseInt(match[1]) || 15 : 15
            const direction = blockText.includes("↻") ? 1 : -1

            spriteState.rotation += degrees * direction
            updateSprite({
              rotation: spriteState.rotation,
              output: `${spriteState.name} turned ${degrees}°`,
            })
            await delay(300)
          }

          // Looks blocks
          else if (blockText.includes("say") && blockText.includes("for") && blockText.includes("seconds")) {
            const textMatch = blockText.match(/\[([^\]]+)\]/)
            const timeMatch = blockText.match(/$$(\d+)$$/)
            const message = textMatch ? textMatch[1] : "Hello!"
            const duration = timeMatch ? Number.parseFloat(timeMatch[1]) || 2 : 2

            spriteState.speech = message
            updateSprite({
              speech: spriteState.speech,
              output: `${spriteState.name} says "${message}"`,
            })
            await delay(duration * 1000)

            spriteState.speech = ""
            updateSprite({ speech: spriteState.speech })
          } else if (blockText.includes("say") && !blockText.includes("for")) {
            const textMatch = blockText.match(/\[([^\]]+)\]/)
            const message = textMatch ? textMatch[1] : "Hello!"

            spriteState.speech = message
            updateSprite({
              speech: spriteState.speech,
              output: `${spriteState.name} says "${message}"`,
            })
            await delay(2000)

            spriteState.speech = ""
            updateSprite({ speech: spriteState.speech })
          }

          // Control blocks
          else if (blockText.includes("wait") && blockText.includes("seconds")) {
            const match = blockText.match(/$$(\d+)$$/)
            const seconds = match ? Number.parseFloat(match[1]) || 1 : 1
            updateSprite({ output: `${spriteState.name} waiting ${seconds}s` })
            await delay(seconds * 1000)
          } else {
            console.log(`⚠️ Unknown block type: ${block.text}`)
            await delay(200)
          }
        } catch (error) {
          console.error(`❌ Error executing block "${block.text}":`, error)
          await delay(200)
        }

        // Small delay between blocks
        await delay(100)
      }
    }

    try {
      await executeBlocks(sprite.blocks)
      console.log(`✅ ${spriteState.name} finished all ${sprite.blocks.length} blocks`)
    } catch (error) {
      console.error(`❌ Error executing ${spriteState.name}:`, error)
    } finally {
      this.runningSprites.delete(sprite.id)
      updateSprite({ output: "" })
      console.log(`🏁 ${spriteState.name} execution completed`)
    }
  }

  // Run ALL sprites with blocks simultaneously
  async runAllSprites() {
    console.log("🚀 RUN ALL: Starting ALL sprites simultaneously...")

    // Reset stop flag
    this.shouldStop = false

    // Get ALL sprites that have blocks
    const spritesToRun = this.sprites.filter((sprite) => sprite.blocks && sprite.blocks.length > 0)

    if (spritesToRun.length === 0) {
      console.log("❌ No sprites with blocks found")
      return
    }

    console.log(`🎭 Running ${spritesToRun.length} sprites simultaneously:`)
    spritesToRun.forEach((sprite) => {
      console.log(`  - ${sprite.name}: ${sprite.blocks.length} blocks`)
    })

    // Clear previous runs
    this.runningSprites.clear()

    // 🔥 KEY FIX: Execute ALL sprites concurrently using Promise.all
    // This means all sprites start at the SAME TIME and run in parallel
    const spritePromises = spritesToRun.map((sprite, index) => {
      console.log(`🚀 [${index + 1}/${spritesToRun.length}] Starting ${sprite.name} concurrently`)

      // Each sprite runs independently and simultaneously
      return this.executeSprite(sprite).catch((error) => {
        console.error(`❌ ${sprite.name} failed:`, error)
        return null // Don't let one sprite failure stop others
      })
    })

    try {
      console.log(`⏱️ Waiting for all ${spritesToRun.length} sprites to complete...`)

      // Wait for ALL sprites to finish (they run simultaneously)
      await Promise.all(spritePromises)

      console.log("🎉 ALL sprites completed their execution simultaneously!")
    } catch (error) {
      console.error("❌ Error in Run All:", error)
    } finally {
      this.runningSprites.clear()
      console.log("🧹 Run All cleanup completed")
    }
  }

  // Run only the selected sprite (Flag button)
  async runSelectedSprite(selectedSpriteId) {
    console.log(`🏁 FLAG: Running ONLY selected sprite ${selectedSpriteId}...`)

    // Reset stop flag
    this.shouldStop = false

    const sprite = this.sprites.find((s) => s.id === selectedSpriteId)

    if (!sprite) {
      console.log("❌ Selected sprite not found")
      return
    }

    if (!sprite.blocks || sprite.blocks.length === 0) {
      console.log(`❌ ${sprite.name} has no blocks to execute`)
      return
    }

    console.log(`🎬 Running ONLY: ${sprite.name} (${sprite.blocks.length} blocks)`)

    // Clear previous runs
    this.runningSprites.clear()

    try {
      await this.executeSprite(sprite)
      console.log(`🎉 ${sprite.name} completed!`)
    } catch (error) {
      console.error(`❌ Error running ${sprite.name}:`, error)
    }
  }

  stop() {
    console.log("🛑 STOP: Stopping all sprites...")
    this.shouldStop = true

    const runningCount = this.runningSprites.size
    this.runningSprites.clear()

    console.log(`🛑 Stopped ${runningCount} running sprites`)

    // Clear all outputs and speech immediately
    this.setSprites((sprites) =>
      sprites.map((sprite) => ({
        ...sprite,
        speech: "",
        output: "",
      })),
    )
  }
}
