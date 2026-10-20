import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { featureTabs } from '../../data/tabs'
import { FeatureTabs } from './FeatureTabs'

const [plan, automate, collaborate] = featureTabs

test('Plan is selected first and shows its content and stat', () => {
  render(<FeatureTabs />)

  expect(screen.getByRole('tab', { name: 'Plan' })).toHaveAttribute('aria-selected', 'true')
  expect(screen.getByRole('tabpanel')).toHaveTextContent(plan.title)
  expect(screen.getByText(`${plan.stat.percent}%`)).toBeInTheDocument()
})

test('clicking a tab changes the displayed content and only one tab stays selected', async () => {
  const user = userEvent.setup()
  render(<FeatureTabs />)

  await user.click(screen.getByRole('tab', { name: 'Automate' }))

  expect(screen.getByRole('tabpanel')).toHaveTextContent(automate.title)
  expect(screen.getByRole('tabpanel')).toHaveTextContent(automate.description)
  expect(screen.queryByText(plan.title)).not.toBeInTheDocument()
  expect(screen.getByText(`${automate.stat.percent}%`)).toBeInTheDocument()
  expect(screen.getByText(automate.stat.label)).toBeInTheDocument()

  const selected = screen.getAllByRole('tab').filter((tab) => tab.getAttribute('aria-selected') === 'true')
  expect(selected).toHaveLength(1)
  expect(selected[0]).toHaveAccessibleName('Automate')
  expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Automate')
})

test('arrow keys, Home and End move selection and focus, wrapping at the ends', async () => {
  const user = userEvent.setup()
  render(<FeatureTabs />)

  screen.getByRole('tab', { name: 'Plan' }).focus()
  await user.keyboard('{ArrowRight}')
  expect(screen.getByRole('tab', { name: 'Automate' })).toHaveFocus()
  expect(screen.getByRole('tabpanel')).toHaveTextContent(automate.title)

  await user.keyboard('{End}')
  expect(screen.getByRole('tab', { name: 'Collaborate' })).toHaveFocus()
  expect(screen.getByRole('tabpanel')).toHaveTextContent(collaborate.title)

  await user.keyboard('{ArrowRight}')
  expect(screen.getByRole('tab', { name: 'Plan' })).toHaveFocus()

  await user.keyboard('{ArrowLeft}')
  expect(screen.getByRole('tab', { name: 'Collaborate' })).toHaveFocus()

  await user.keyboard('{Home}')
  expect(screen.getByRole('tab', { name: 'Plan' })).toHaveFocus()
})

test('every tab controls the one tabpanel, which is labelled by the selected tab', async () => {
  const user = userEvent.setup()
  render(<FeatureTabs />)

  const panel = screen.getByRole('tabpanel')
  for (const tab of screen.getAllByRole('tab')) {
    // aria-controls must point at an element that exists, for selected and unselected tabs alike.
    expect(document.getElementById(tab.getAttribute('aria-controls')!)).toBe(panel)
  }

  for (const name of ['Plan', 'Automate', 'Collaborate']) {
    await user.click(screen.getByRole('tab', { name }))
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', screen.getByRole('tab', { name }).id)
  }
})

test('exactly one live region exists and the tabpanel is not inside it (no duplicate announcements)', () => {
  const { container } = render(<FeatureTabs />)
  const liveRegions = container.querySelectorAll('[aria-live]')
  expect(liveRegions).toHaveLength(1)
  expect(liveRegions[0]).not.toContainElement(screen.getByRole('tabpanel'))
  expect(liveRegions[0]).toHaveTextContent(`${plan.stat.percent}%`)
})

test('only the selected tab is reachable with the Tab key', () => {
  render(<FeatureTabs />)
  expect(screen.getByRole('tab', { name: 'Plan' })).toHaveAttribute('tabindex', '0')
  expect(screen.getByRole('tab', { name: 'Automate' })).toHaveAttribute('tabindex', '-1')
  expect(screen.getByRole('tab', { name: 'Collaborate' })).toHaveAttribute('tabindex', '-1')
})
