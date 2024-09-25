import { ThemeProvider, useTheme } from '@emotion/react'
import type { LiftedAction, LiftedState } from '@redux-devtools/core'
import { ActionCreators } from '@redux-devtools/core'
import type { Delta, DiffContext } from 'jsondiffpatch'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { Base16Theme } from 'react-base16-styling'
import type { Action, Dispatch } from 'redux'

import ActionList from './ActionList'
import ActionPreview from './ActionPreview'
import type { Tab } from './ActionPreview'
import createDiffPatcher from './createDiffPatcher'
import { reducer, updateMonitorState } from './redux'
import type { DevtoolsInspectorAction, DevtoolsInspectorState } from './redux'
import getInspectedState from './utils/getInspectedState'
import {
  createInspectorMonitorThemeFromBase16Theme,
  resolveBase16Theme,
} from './utils/themes'
import type { Base16ThemeName } from './utils/themes'

const {
  commit,
  sweep,
  toggleAction,
  jumpToAction,
  jumpToState,
  reorderAction,
} = ActionCreators

function getLastActionId(stagedActionIds) {
  return stagedActionIds[stagedActionIds.length - 1]
}

function getCurrentActionId(
  { stagedActionIds, currentStateIndex },
  monitorState: DevtoolsInspectorState,
) {
  return monitorState.selectedActionId ?? stagedActionIds[currentStateIndex]
}

function getFromState<S>(
  actionIndex: number,
  stagedActionIds: number[],
  computedStates: { state: S; error?: string }[],
  monitorState: DevtoolsInspectorState,
) {
  const { startActionId } = monitorState
  if (startActionId === null) {
    return actionIndex > 0 ? computedStates[actionIndex - 1] : null
  }
  let fromStateIdx = stagedActionIds.indexOf(startActionId - 1)
  if (fromStateIdx === -1) fromStateIdx = 0
  return computedStates[fromStateIdx]
}

function createIntermediateState(
  {
    supportImmutable,
    computedStates,
    stagedActionIds,
    actionsById: actions,
    diffObjectHash,
    diffPropertyFilter,
    currentStateIndex,
  },
  monitorState: DevtoolsInspectorState,
) {
  const { inspectedStatePath, inspectedActionPath } = monitorState
  const currentActionId = getCurrentActionId(
    { stagedActionIds, currentStateIndex },
    monitorState,
  )
  const currentAction =
    actions[currentActionId] && actions[currentActionId].action

  const actionIndex = stagedActionIds.indexOf(currentActionId)
  const fromState = getFromState(
    actionIndex,
    stagedActionIds,
    computedStates,
    monitorState,
  )
  const toState = computedStates[actionIndex]
  const error = toState?.error

  const fromInspectedState =
    !error &&
    fromState &&
    getInspectedState(fromState.state, inspectedStatePath, supportImmutable)
  const toInspectedState =
    !error &&
    toState &&
    getInspectedState(toState.state, inspectedStatePath, supportImmutable)
  const delta =
    !error &&
    fromState &&
    toState &&
    createDiffPatcher(diffObjectHash, diffPropertyFilter).diff(
      fromInspectedState,
      toInspectedState,
    )

  return {
    delta,
    nextState:
      toState && getInspectedState(toState.state, inspectedStatePath, false),
    action: getInspectedState(currentAction, inspectedActionPath, false),
    error,
  }
}

export interface ExternalProps<S, A extends Action<string>> {
  dispatch: Dispatch<
    DevtoolsInspectorAction | LiftedAction<S, A, DevtoolsInspectorState>
  >
  preserveScrollTop?: boolean
  draggableActions: boolean
  select: (state: S) => unknown
  theme: Base16ThemeName | Base16Theme
  supportImmutable: boolean
  diffObjectHash?: (item: unknown, index: number) => string
  diffPropertyFilter?: (name: string, context: DiffContext) => boolean
  hideMainButtons?: boolean
  hideActionButtons?: boolean
  invertTheme: boolean
  sortStateTreeAlphabetically: boolean
  disableStateTreeCollection: boolean
  dataTypeKey?: string | symbol
  tabs: Tab<S, A>[] | ((tabs: Tab<S, A>[]) => Tab<S, A>[])
}

interface DefaultProps {
  select: (state: unknown) => unknown
  supportImmutable: boolean
  draggableActions: boolean
  theme: Base16ThemeName
  invertTheme: boolean
}

export interface DevtoolsInspectorProps<S, A extends Action<string>>
  extends LiftedState<S, A, DevtoolsInspectorState> {
  dispatch: Dispatch<
    DevtoolsInspectorAction | LiftedAction<S, A, DevtoolsInspectorState>
  >
  preserveScrollTop?: boolean
  draggableActions: boolean
  select: (state: S) => unknown
  theme: Base16ThemeName | Base16Theme
  supportImmutable: boolean
  diffObjectHash?: (item: unknown, index: number | undefined) => string
  diffPropertyFilter?: (name: string, context: DiffContext) => boolean
  hideMainButtons?: boolean
  hideActionButtons?: boolean
  sortStateTreeAlphabetically: boolean
  disableStateTreeCollection: boolean
  invertTheme: boolean
  dataTypeKey?: string | symbol
  tabs: Tab<S, A>[] | ((tabs: Tab<S, A>[]) => Tab<S, A>[])
}

interface State<S, A extends Action<string>> {
  delta: Delta | null | undefined | false
  nextState: S
  action: A
  error: string | undefined
}

export const DevtoolsInspector = <S, A extends Action<string>>({
  supportImmutable = false,
  draggableActions = true,
  theme = 'inspector',
  invertTheme = true,
  monitorState,
  dispatch,
  stagedActionIds,
  actionsById,
  computedStates,
  skippedActionIds,
  hideMainButtons,
  hideActionButtons,
  tabs,
  dataTypeKey,
  sortStateTreeAlphabetically,
  disableStateTreeCollection,
  currentStateIndex,
  diffObjectHash,
  diffPropertyFilter,
}: DevtoolsInspectorProps<S, A>) => {
  const [wideLayoutState, setWideLayoutState] = useState(false)

  const emotionTheme = useTheme()

  const inspectorRef = useRef<HTMLDivElement | null>(null)
  const updateSizeTimeout = useRef<number | undefined>(undefined)

  const updateSizeMode = useCallback(() => {
    const isWideLayout = inspectorRef.current!.offsetWidth > 500
    if (isWideLayout !== wideLayoutState) {
      setWideLayoutState(isWideLayout)
    }
  }, [wideLayoutState])

  useEffect(() => {
    updateSizeMode()
    updateSizeTimeout.current = window.setInterval(updateSizeMode, 150)
    return () => {
      clearTimeout(updateSizeTimeout.current)
    }
  }, [updateSizeMode])

  const handleToggleAction = (actionId: number) => {
    dispatch(toggleAction(actionId))
  }

  const handleJumpToState = (actionId: number) => {
    if (jumpToAction) {
      dispatch(jumpToAction(actionId))
    } else {
      const index = stagedActionIds.indexOf(actionId)
      if (index !== -1) dispatch(jumpToState(index))
    }
  }

  const handleReorderAction = (actionId: number, beforeActionId: number) => {
    if (reorderAction) dispatch(reorderAction(actionId, beforeActionId))
  }

  const handleCommit = () => {
    dispatch(commit())
  }

  const handleSweep = () => {
    dispatch(sweep())
  }

  const handleSearch = (val: string) => {
    dispatch(updateMonitorState({ searchValue: val }))
  }

  const handleSelectAction = (
    e: React.MouseEvent<HTMLDivElement>,
    actionId: number,
  ) => {
    let startActionId
    let selectedActionId

    if (e.shiftKey && monitorState.selectedActionId !== null) {
      if (monitorState.startActionId !== null) {
        if (actionId >= monitorState.startActionId) {
          startActionId = Math.min(
            monitorState.startActionId,
            monitorState.selectedActionId,
          )
          selectedActionId = actionId
        } else {
          selectedActionId = Math.max(
            monitorState.startActionId,
            monitorState.selectedActionId,
          )
          startActionId = actionId
        }
      } else {
        startActionId = Math.min(actionId, monitorState.selectedActionId)
        selectedActionId = Math.max(actionId, monitorState.selectedActionId)
      }
    } else {
      startActionId = null
      if (
        actionId === monitorState.selectedActionId ||
        monitorState.startActionId !== null
      ) {
        selectedActionId = null
      } else {
        selectedActionId = actionId
      }
    }

    dispatch(updateMonitorState({ startActionId, selectedActionId }))
  }

  const handleInspectPath = (
    pathType: 'inspectedActionPath' | 'inspectedStatePath',
    path: (string | number)[],
  ) => {
    dispatch(updateMonitorState({ [pathType]: path }))
  }

  const handleSelectTab = (tabName: string) => {
    dispatch(updateMonitorState({ tabName }))
  }

  const { action, nextState, delta, error }: State<S, A> = {
    ...createIntermediateState(
      {
        supportImmutable,
        computedStates,
        stagedActionIds,
        actionsById,
        diffObjectHash,
        diffPropertyFilter,
        currentStateIndex,
      },
      monitorState,
    ),
  }

  const { selectedActionId, startActionId, searchValue, tabName } = monitorState
  const inspectedPathType =
    tabName === 'Action' ? 'inspectedActionPath' : 'inspectedStatePath'

  const base16Theme = resolveBase16Theme(theme)!
  const inspectorMonitorTheme = createInspectorMonitorThemeFromBase16Theme(
    base16Theme,
    invertTheme,
  )
  return (
    <ThemeProvider theme={inspectorMonitorTheme}>
      <div
        key="inspector"
        data-testid="inspector"
        ref={inspectorRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          fontFamily: 'monaco, Consolas, "Lucida Console", monospace',
          fontSize: '12px',
          WebkitFontSmoothing: 'antialiased',
          lineHeight: '1.5em',

          backgroundColor: emotionTheme.BACKGROUND_COLOR,
          color: emotionTheme.TEXT_COLOR,
          ...(wideLayoutState && { flexDirection: 'row' }),
        }}>
        <ActionList
          actions={actionsById}
          actionIds={stagedActionIds}
          isWideLayout={wideLayoutState}
          searchValue={searchValue}
          selectedActionId={selectedActionId}
          startActionId={startActionId}
          skippedActionIds={skippedActionIds}
          draggableActions={draggableActions}
          hideMainButtons={hideMainButtons}
          hideActionButtons={hideActionButtons}
          onSearch={handleSearch}
          onSelect={handleSelectAction}
          onToggleAction={handleToggleAction}
          onJumpToState={handleJumpToState}
          onCommit={handleCommit}
          onSweep={handleSweep}
          onReorderAction={handleReorderAction}
          currentActionId={stagedActionIds[currentStateIndex]}
          lastActionId={getLastActionId(stagedActionIds)}
        />
        <ActionPreview
          base16Theme={base16Theme}
          invertTheme={invertTheme}
          isWideLayout={wideLayoutState}
          tabs={tabs}
          tabName={tabName}
          delta={delta}
          error={error}
          nextState={nextState}
          computedStates={computedStates}
          action={action}
          actions={actionsById}
          selectedActionId={selectedActionId}
          startActionId={startActionId}
          dataTypeKey={dataTypeKey}
          sortStateTreeAlphabetically={sortStateTreeAlphabetically}
          disableStateTreeCollection={disableStateTreeCollection}
          monitorState={monitorState}
          updateMonitorState={(
            monitorState: Partial<DevtoolsInspectorState>,
          ) => {
            dispatch(updateMonitorState(monitorState))
          }}
          onInspectPath={(path: (string | number)[]) =>
            handleInspectPath(inspectedPathType, path)
          }
          inspectedPath={monitorState[inspectedPathType] ?? []}
          onSelectTab={handleSelectTab}
        />
      </div>
    </ThemeProvider>
  )
}

DevtoolsInspector.update = reducer

export default DevtoolsInspector as unknown as React.ComponentType<
  ExternalProps<unknown, Action<string>>
> & {
  update(
    monitorProps: ExternalProps<unknown, Action<string>>,
    state: DevtoolsInspectorState | undefined,
    action: DevtoolsInspectorAction,
  ): DevtoolsInspectorState
  defaultProps: DefaultProps
}
