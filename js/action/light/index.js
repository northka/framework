/**
 * Created by chenchaochao on 16/4/2.
 */

import * as lights from '../../constants/TrafficLight'

export function changeGreen(){
    return {type:lights.CHANGE_GREEN}
}

export function changeYellow(){
    return {type:lights.CHANGE_YELLOW}
}

export function changeRed(){
    return {type:lights.CHANGE_RED}
}


