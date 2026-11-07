import { ImageResponse } from 'next/og.js'
import React from 'react'
import fs from 'node:fs/promises'

const regular = await fs.readFile('public/fonts/geist-regular.ttf')
const semibold = await fs.readFile('public/fonts/geist-semibold.ttf')
const element = React.createElement
const card = new ImageResponse(element('div', { style: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#000', color: '#f4f4f5', padding: '64px', fontFamily: 'Geist', border: '1px solid #313131' } },
  element('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 24 } }, element('span', null, 'Jithendra Kantharaju'), element('span', { style: { color: '#67e8f9' } }, 'jk.')),
  element('div', { style: { display: 'flex', flexDirection: 'column', fontSize: 60, fontWeight: 600, lineHeight: 1.1, letterSpacing: '-3px', marginTop: 64 } }, element('span', null, 'Cloud infrastructure.'), element('span', null, 'Reliable delivery.'), element('span', { style: { color: '#67e8f9' } }, 'Applied AI.')),
  element('div', { style: { marginTop: 48, color: '#acacb5', fontSize: 20 } }, 'DEVOPS / CLOUD / SRE / FDE / AI ENGINEERING')
), { width: 1200, height: 630, fonts: [{ name: 'Geist', data: regular, weight: 400 }, { name: 'Geist', data: semibold, weight: 600 }] })
await fs.writeFile('public/social-card.png', Buffer.from(await card.arrayBuffer()))
console.log('Created public/social-card.png')
