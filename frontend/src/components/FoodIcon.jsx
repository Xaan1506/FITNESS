import React from 'react'

export default function FoodIcon({category, size=36}){
  // simple category -> SVG/emoji mapping (keeps assets minimal for mobile)
  const style = {width:size, height:size, display:'inline-block'};
  switch((category||'').toLowerCase()){
    case 'fruit':
      return <div style={style} aria-hidden>🍎</div>
    case 'vegetable':
      return <div style={style} aria-hidden>🥦</div>
    case 'grain':
    case 'rice':
      return <div style={style} aria-hidden>🌾</div>
    case 'pulse':
    case 'indian':
      return <div style={style} aria-hidden>🍛</div>
    case 'dairy':
      return <div style={style} aria-hidden>🧀</div>
    case 'fast food':
    case 'snack':
      return <div style={style} aria-hidden>🍟</div>
    case 'non-veg':
      return <div style={style} aria-hidden>🍗</div>
    case 'beverage':
      return <div style={style} aria-hidden>🥤</div>
    default:
      return <div style={style} aria-hidden>🍽️</div>
  }
}
