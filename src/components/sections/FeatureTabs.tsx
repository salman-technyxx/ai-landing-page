import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { featureTabs } from '../../data/tabs'
import { Container } from '../ui/Container'

const tabId = (id: string) => `feature-tab-${id}`
// One panel element is always in the DOM and its content swaps, so every tab's `aria-controls`
// points at an element that exists, and `aria-labelledby` follows the selected tab.
const PANEL_ID = 'feature-tabpanel'

// Tabs pattern from the WAI-ARIA authoring guide: one tablist, one selected tab, arrow keys
// move between tabs (Home/End jump to the ends), and only the selected tab is in the Tab order.
export function FeatureTabs() {
  const [activeId, setActiveId] = useState(featureTabs[0].id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const activeIndex = featureTabs.findIndex((tab) => tab.id === activeId)
  const active = featureTabs[activeIndex]

  const selectIndex = (index: number) => {
    setActiveId(featureTabs[index].id)
    tabRefs.current[index]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const last = featureTabs.length - 1
    if (event.key === 'ArrowRight') selectIndex(activeIndex === last ? 0 : activeIndex + 1)
    else if (event.key === 'ArrowLeft') selectIndex(activeIndex === 0 ? last : activeIndex - 1)
    else if (event.key === 'Home') selectIndex(0)
    else if (event.key === 'End') selectIndex(last)
    else return
    event.preventDefault()
  }

  return (
    // "How It Works" in the navigation scrolls here.
    <section id="how-it-works" aria-labelledby="tabs-heading" className="py-6 md:py-14">
      <Container>
        <div className="rounded-3xl bg-soft p-5 sm:p-8 md:p-10 xl:grid xl:grid-cols-[minmax(0,1fr)_487px] xl:items-center xl:gap-8">
          <div>
            <h2 id="tabs-heading" className="text-[30px] leading-[37.5px] font-extrabold text-ink">
              Plan, automate, collaborate
            </h2>
            <p className="mt-1 text-sm leading-[21px] text-muted">One workflow, three ways to move work forward.</p>

            <div role="tablist" aria-label="FlowPilot workflow" onKeyDown={handleKeyDown} className="mt-6 flex gap-3">
              {featureTabs.map((tab, index) => {
                const selected = tab.id === activeId
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabRefs.current[index] = el
                    }}
                    id={tabId(tab.id)}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={PANEL_ID}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveId(tab.id)}
                    className={`h-10 flex-1 rounded-button text-xs leading-[18px] font-semibold transition-colors md:w-[108px] md:flex-none ${
                      selected ? 'bg-brand text-white' : 'bg-white text-ink hover:text-brand-blue'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div
              id={PANEL_ID}
              role="tabpanel"
              aria-labelledby={tabId(active.id)}
              className="mt-8 max-w-[560px] rounded-[14px] border border-line bg-white px-[25px] py-4"
            >
              <h3 className="text-base leading-[22px] font-bold text-ink">{active.title}</h3>
              <p className="text-xs leading-[18px] text-muted">{active.description}</p>
            </div>
          </div>

          {/* The only live region. The panel itself is not live, so the title and description are not
              announced twice: the tab announces its own selection, and this announces the new figure. */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="mt-6 rounded-2xl border border-line bg-white p-8 xl:mt-0 xl:flex xl:min-h-[210px] xl:flex-col xl:justify-center"
          >
            <p className="text-[40px] leading-10 font-extrabold text-ink">{active.stat.percent}%</p>
            <p className="mt-1 text-[13px] leading-[19.5px] font-medium text-muted">{active.stat.label}</p>
            <div aria-hidden="true" className="mt-6 h-4 w-full max-w-[420px] overflow-hidden rounded-lg bg-[#eef2ff]">
              <div
                className="h-full rounded-lg bg-brand transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${active.stat.percent}%` }}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
