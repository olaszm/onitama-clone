import React from 'react'
import { MoveElementProp } from '../types'

function MoveCardElement({isActive, move}:  MoveElementProp) {
    return (
        <div className={`grid_item ${isActive ? "selected" : ""}`}>
            {move.name}
        </div>
    )
}

export default MoveCardElement
