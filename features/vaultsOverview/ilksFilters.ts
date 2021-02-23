import { IlkData, IlkWithBalance } from "blockchain/ilks";
import { compareBigNumber } from "helpers/compare";
import { Change, Direction, toggleSort } from "helpers/form";
import { Observable, Subject } from "rxjs";
import { map, scan, startWith, switchMap } from "rxjs/operators";

export type IlkSortBy =
    | 'ilkDebtAvailable'
    | 'stabilityFee'
    | 'liquidationRatio'
    | 'balance'
    | undefined

export interface IlksFilterState {
    sortBy: IlkSortBy
    direction: Direction
    change: (ch: Changes) => void
}

type Changes = Change<IlksFilterState, 'sortBy'>

function applyFilter(state: IlksFilterState, change: Changes): IlksFilterState {
    switch (change.kind) {
        case 'sortBy':
            const [sortBy, direction] = toggleSort(state.sortBy, state.direction, change.sortBy)
            return {
                ...state,
                sortBy,
                direction,
            }
        default:
            return state
    }
}

function sortIlks(ilks: IlkWithBalance[], sortBy: IlkSortBy, direction: Direction): IlkWithBalance[] {
    const filter = `${sortBy}_${direction}`
    switch (filter) {
        case 'ilkDebtAvailable_ASC':
            return ilks.sort((a, b) => compareBigNumber(a.ilkDebtAvailable, b.ilkDebtAvailable))
        case 'ilkDebtAvailable_DESC':
            return ilks.sort((a, b) => compareBigNumber(b.ilkDebtAvailable, a.ilkDebtAvailable))
        case 'stabilityFee_ASC':
            return ilks.sort((a, b) => compareBigNumber(a.stabilityFee, b.stabilityFee))
        case 'stabilityFee_DESC':
            return ilks.sort((a, b) => compareBigNumber(b.stabilityFee, a.stabilityFee))
        case 'liquidationRatio_ASC':
            return ilks.sort((a, b) => compareBigNumber(a.liquidationRatio, b.liquidationRatio))
        case 'liquidationRatio_DESC':
            return ilks.sort((a, b) => compareBigNumber(b.liquidationRatio, a.liquidationRatio))
        case 'balance_ASC':
            return ilks.sort((a, b) => compareBigNumber(a.balance, b.balance))
        case 'balance_DESC':
            return ilks.sort((a, b) => compareBigNumber(b.balance, a.balance))
        default:
            return ilks
    }
}

export interface IlksWithFilters {
    data: IlkWithBalance[],
    filters: IlksFilterState
}
export function ilksWithFilter$(vaults$: Observable<IlkWithBalance[]>): Observable<IlksWithFilters> {
    const change$ = new Subject<Changes>()
    function change(ch: Changes) {
        change$.next(ch)
    }

    const initialState: IlksFilterState = {
        sortBy: undefined,
        direction: undefined,
        change
    }

    return change$.pipe(
        scan(applyFilter, initialState),
        startWith(initialState),
        switchMap(filters => vaults$.pipe(
            map(ilks => sortIlks(ilks, filters.sortBy, filters.direction)),
            map(ilks => ({ filters, data: ilks }))
        ))
    )
}