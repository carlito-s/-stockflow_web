import { describe, it, expect, beforeEach } from "vitest"
import { useUiStore } from "./ui.store"

describe("uiStore", () => {
  beforeEach(() => {
    useUiStore.setState({ sidebarOpen: false })
  })

  it("sidebarOpen starts as false", () => {
    expect(useUiStore.getState().sidebarOpen).toBe(false)
  })

  it("toggleSidebar flips state", () => {
    useUiStore.getState().toggleSidebar()
    expect(useUiStore.getState().sidebarOpen).toBe(true)
    useUiStore.getState().toggleSidebar()
    expect(useUiStore.getState().sidebarOpen).toBe(false)
  })

  it("closeSidebar sets false", () => {
    useUiStore.setState({ sidebarOpen: true })
    useUiStore.getState().closeSidebar()
    expect(useUiStore.getState().sidebarOpen).toBe(false)
  })
})
