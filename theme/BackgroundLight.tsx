import React from 'react'
import { Box, Image } from 'theme-ui'

import { staticFilesRuntimeUrl } from '../helpers/staticPaths'

export function BackgroundLight() {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 'calc((100% - 1617px) / 2)',
        top: 0,
        right: 0,
        zIndex: -1,
        backgroundColor: 'white',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <Image src={staticFilesRuntimeUrl('/static/img/background/background_light.png')} />
      </Box>
    </Box>
  )
}
