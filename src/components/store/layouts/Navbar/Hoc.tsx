import { ComponentType } from "react"
import { NavbarItem } from "./type"

export default   function Hoc<P extends object> (Component:ComponentType<P>){
    return function EnhancedComp(props:P){

        return(
            <Component {...props}/>
        )
    }
}