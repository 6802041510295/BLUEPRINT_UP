import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path, Circle, Rect, Ellipse, G, Text as SvgText } from 'react-native-svg';
export function RetroArt({ kind = 'phone', size = 160 }: { kind?: 'phone' | 'heart' | 'star' | 'disc'; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 200 200">
    <Defs>
      <LinearGradient id="pink" x1="0%" y1="0%" x2="100%" y2="100%"><Stop offset="0" stopColor="#fff3ff"/><Stop offset=".28" stopColor="#ef9eda"/><Stop offset=".55" stopColor="#ffdaf3"/><Stop offset="1" stopColor="#b73b99"/></LinearGradient>
      <LinearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="100%"><Stop offset="0" stopColor="#fff"/><Stop offset=".2" stopColor="#949cb9"/><Stop offset=".4" stopColor="#eee5ff"/><Stop offset=".58" stopColor="#8da7ca"/><Stop offset=".75" stopColor="#fff"/><Stop offset="1" stopColor="#737690"/></LinearGradient>
      <LinearGradient id="holo" x1="0%" y1="0%" x2="100%" y2="100%"><Stop offset="0" stopColor="#d8c4ff"/><Stop offset=".25" stopColor="#fff5c1"/><Stop offset=".5" stopColor="#afe9f1"/><Stop offset=".75" stopColor="#fac1e5"/><Stop offset="1" stopColor="#e4d5ff"/></LinearGradient>
    </Defs>
    {kind === 'heart' && <><Path d="M100 174C78 150 22 111 22 67C22 25 75 16 100 53C125 16 178 25 178 67C178 111 122 150 100 174Z" fill="url(#pink)" stroke="#46344f" strokeWidth="3"/><Path d="M44 67C42 43 65 36 77 46" stroke="#fff" strokeWidth="9" strokeLinecap="round" fill="none"/><Path d="M137 124l8-15" stroke="#a94c94" strokeWidth="2"/></>}
    {kind === 'star' && <><Path d="M100 9L124 71L190 75L139 117L155 184L100 146L45 184L61 117L10 75L77 71Z" fill="url(#chrome)" stroke="#494554" strokeWidth="3"/><Path d="M100 9L100 107L10 75M100 107L155 184M100 107L45 184M100 107L190 75" stroke="#fff" strokeOpacity=".75" strokeWidth="2" fill="none"/></>}
    {kind === 'disc' && <><Circle cx="100" cy="100" r="86" fill="url(#holo)" stroke="#6d6b87" strokeWidth="2"/><Circle cx="100" cy="100" r="76" fill="none" stroke="#fff" strokeOpacity=".6"/><Path d="M34 45L80 88L69 70L66 22Z" fill="#fff" opacity=".5"/><Circle cx="100" cy="100" r="27" fill="url(#chrome)" stroke="#7c7793"/><Circle cx="100" cy="100" r="13" fill="#faf7fd" stroke="#817e98"/><Path d="M109 126L151 169M125 118L172 142" stroke="#fff" strokeWidth="10" opacity=".4"/></>}
    {kind === 'phone' && <G transform="rotate(13 100 100)">
      <Ellipse cx="100" cy="182" rx="56" ry="8" fill="#c8b5d3" opacity=".4"/>
      <Rect x="55" y="11" width="91" height="89" rx="20" fill="url(#chrome)" stroke="#4a3c57" strokeWidth="2"/>
      <Rect x="60" y="15" width="81" height="80" rx="18" fill="url(#pink)" stroke="#e6e6ef" strokeWidth="2"/>
      <Rect x="67" y="27" width="66" height="50" rx="7" fill="#2f283d" stroke="#fff0fb" strokeWidth="3"/>
      <Path d="M91 39L108 58L100 66V32L108 40L91 57" fill="none" stroke="#e8b2fb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M85 20h28" stroke="#87667b" strokeWidth="3" strokeLinecap="round"/>
      <Circle cx="101" cy="85" r="3" fill="#fff"/>
      <Rect x="53" y="93" width="95" height="12" rx="6" fill="url(#chrome)" stroke="#68526b"/>
      <Path d="M55 108Q52 100 65 103H137Q146 104 147 113L141 169Q139 183 124 184H73Q55 182 54 169Z" fill="url(#pink)" stroke="#5e4563" strokeWidth="2"/>
      <Rect x="59" y="109" width="83" height="19" rx="8" fill="url(#chrome)" stroke="#a5839d"/>
      <Circle cx="100" cy="117" r="11" fill="#fbc9ec" stroke="#765575" strokeWidth="2"/><Circle cx="100" cy="117" r="5" fill="#fff1fb"/>
      {[0,1,2,3].map(row => [0,1,2].map(col => <Rect key={`${row}-${col}`} x={66+col*24} y={134+row*10} width="19" height="7" rx="3" fill="#fff2fc" stroke="#9c678d" strokeWidth=".7"/>))}
      <Path d="M142 44Q171 64 149 84" fill="none" stroke="#987799" strokeWidth="2"/><Path d="M161 79l4 9 10 1-8 7 2 10-9-6-9 5 2-10-7-7 10-1z" fill="url(#chrome)" stroke="#776482"/>
    </G>}
  </Svg>;
}
