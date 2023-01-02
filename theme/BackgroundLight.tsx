import React from 'react'
import { Box } from 'theme-ui'

import { staticFilesRuntimeUrl } from '../helpers/staticPaths'

export function BackgroundLight() {
  return (
    <Box
      sx={{
        position: 'absolute',
        height: '100%',
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
          height: '100%',
          pointerEvents: 'none',
          background: `url(${staticFilesRuntimeUrl(
            '/static/img/background/background_light.png',
          )})`,
          backgroundRepeat: 'repeat',
        }}
      ></Box>
    </Box>
  )
}
