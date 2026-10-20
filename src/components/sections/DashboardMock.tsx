type Status = 'In Progress' | 'Completed' | 'Upcoming'

// `short` is the label Figma uses in the compact (mobile) mock.
const navItems = ['Overview', 'Tasks', 'Automations', 'Team', 'Analytics', 'Settings']

const stats = [
  { value: '12', label: 'Active Tasks', short: 'Active Tasks' },
  { value: '4', label: 'AI Suggestions', short: 'AI Suggest.' },
  { value: '85%', label: 'Project Progress', short: 'Progress' },
]

const tasks: { label: string; short: string; status: Status }[] = [
  { label: 'Design landing page', short: 'Design landing page', status: 'In Progress' },
  { label: 'Update documentation', short: 'Update docs', status: 'Completed' },
  { label: 'Team sync meeting', short: 'Team sync', status: 'Upcoming' },
  { label: 'Review pull requests', short: 'Review PRs', status: 'Upcoming' },
]

const statusColor: Record<Status, string> = {
  'In Progress': 'text-accent-orange',
  Completed: 'text-accent-green',
  Upcoming: 'text-subtle',
}

// The greeting, the three stat cards and today's tasks. Shared by both layouts below.
// Text sizes switch with the card's own width (container query: compact under 576px, full size from 576px).
function MockContent({ className }: { className: string }) {
  return (
    <div className={className}>
      <p className="text-sm leading-[21px] font-bold text-ink @xl:text-xl @xl:leading-[25px]">Good morning, Sarah!</p>
      <p className="text-[9.5px] leading-[11.88px] text-muted @xl:mt-1 @xl:text-[11px] @xl:leading-[16.5px]">
        Here&apos;s what is happening with your team today.
      </p>

      <div className="mt-2 grid grid-cols-3 gap-1.5 @xl:mt-3 @xl:gap-2.5">
        {stats.map((stat) => (
          <div
            key={stat.value}
            className="flex flex-col items-center rounded-lg border border-line bg-[#fbfcfe] p-[5px] text-center @xl:h-[82px] @xl:items-start @xl:justify-center @xl:rounded-xl @xl:px-[13px] @xl:py-0 @xl:text-left"
          >
            <span className="text-sm leading-[14px] font-bold text-ink @xl:text-[21px] @xl:leading-[26.25px]">{stat.value}</span>
            <span className="mt-0.5 text-[8px] leading-[10px] font-medium text-muted @xl:mt-1 @xl:text-[11px] @xl:leading-[16.5px]">
              <span className="@xl:hidden">{stat.short}</span>
              <span className="hidden @xl:inline">{stat.label}</span>
            </span>
          </div>
        ))}
      </div>

      <p className="mt-2.5 text-[11px] leading-[16.5px] font-bold text-ink @xl:mt-5 @xl:pb-2 @xl:text-sm @xl:leading-[21px]">
        Today&apos;s Tasks
      </p>
      <ul className="mt-1 border-t border-[#eef1f6] @xl:mt-0">
        {tasks.map((task) => (
          <li
            key={task.label}
            className="flex items-center justify-between border-b border-[#eef1f6] py-1 last:border-b-0 @xl:pt-2 @xl:pb-[9px] @xl:last:border-b-0"
          >
            <span className="flex items-center gap-1.5 @xl:gap-3">
              <span className="size-3.5 rounded bg-[#f1f5ff] @xl:size-[18px] @xl:rounded-md" />
              <span className="text-[9.5px] leading-[14.25px] font-medium text-ink @xl:text-xs @xl:leading-[18px]">
                <span className="@xl:hidden">{task.short}</span>
                <span className="hidden @xl:inline">{task.label}</span>
              </span>
            </span>
            <span className={`text-[8.5px] leading-[12.75px] font-semibold @xl:text-[11px] @xl:leading-[16.5px] ${statusColor[task.status]}`}>
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Two layouts, chosen by the screen width:
// - 769px and up: Figma's mock, a vertical sidebar next to the content (sized by the card's width).
// - 768px and below: a column. The navigation (Overview, Tasks, Automations, ...) becomes a horizontal strip that
//   scrolls sideways instead of being squeezed, and the content sits underneath at the full width of the card.
// The mock is a decorative picture, so it is exposed to assistive tech as one image and the repeated
// navigation text in the hidden layout is not read out.
export function DashboardMock() {
  return (
    <div className="@container w-full">
      <div
        role="img"
        aria-label="FlowPilot dashboard preview showing active tasks, AI suggestions, project progress and today's tasks"
        className="overflow-clip rounded-[18px] border border-line bg-white shadow-card"
      >
        {/* 768px and below: column layout with a horizontally scrollable navigation strip. */}
        <div className="flex flex-col gap-3 p-[15px] min-[769px]:hidden">
          <div className="min-w-0 rounded-[14px] border border-divider bg-surface p-4">
            <p className="pb-2 text-[13px] leading-[19.5px] font-bold text-ink @xl:text-[17px] @xl:leading-[25.5px]">FlowPilot</p>
            {/* The negative margin lets the strip scroll right up to the edge of the panel; each item keeps its size. */}
            <div className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 [scrollbar-color:#dce3f0_transparent] [scrollbar-width:thin]">
              {navItems.map((item, index) => (
                <p
                  key={item}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] leading-[16.5px] whitespace-nowrap @xl:text-[13px] @xl:leading-[19.5px] ${
                    index === 0 ? 'bg-[#eaf0ff] font-semibold text-brand-blue' : 'font-medium text-muted'
                  }`}
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
          <MockContent className="min-w-0 @xl:px-1 @xl:pb-1" />
        </div>

        {/* 769px and up: Figma's row layout (unchanged). */}
        <div className="hidden gap-0 p-[15px] min-[769px]:flex @xl:h-[430px] @xl:gap-4 @xl:p-[17px]">
          <div className="flex w-[110px] shrink-0 flex-col gap-1.5 rounded-[14px] border border-divider bg-surface p-[11px] @xl:h-[398px] @xl:w-[150px] @xl:gap-1 @xl:border-0 @xl:p-4">
            <p className="p-1 pb-2 text-[13px] leading-[19.5px] font-bold text-ink @xl:p-0 @xl:pb-4 @xl:text-[17px] @xl:leading-[25.5px]">
              FlowPilot
            </p>
            {navItems.map((item, index) => (
              <p
                key={item}
                className={`px-2 py-1 text-[11px] leading-[16.5px] @xl:flex @xl:h-8 @xl:items-center @xl:px-3 @xl:py-0 @xl:text-[13px] @xl:leading-[19.5px] ${
                  index === 0 ? 'rounded-lg bg-[#eaf0ff] font-semibold text-brand-blue' : 'font-medium text-muted'
                }`}
              >
                {item}
              </p>
            ))}
          </div>
          <MockContent className="min-w-0 flex-1 pl-3 @xl:py-2 @xl:pr-2 @xl:pl-0" />
        </div>
      </div>
    </div>
  )
}
