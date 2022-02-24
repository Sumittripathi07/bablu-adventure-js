const stageMap = {
  timeout: 60,
  stages: [
    {
      id: 1,
      y: -180,
      image: 'stage'
    },
    {
      id: 2,
      y: -180,
      image: 'stage',
      width: 600
    },
    {
      id: 3,
      x: 300,
      y: -180,
      image: 'stage',
      width: 600
    },
    {
      id: 5,
      y: -320,
      image: 'hanger'
    },
    {
      id: 6,
      x: 100,
      y: -420,
      image: 'hanger',
      repeat: 2
    },
    {
      id: 7,
      x: 200,
      y: -180,
      image: 'stage',
      width: 600
    },
    {
      id: 8,
      x: 150,
      y: -320,
      image: 'hanger',
      repeat: 2
    },
    {
      id: 9,
      x: 150,
      y: -460,
      image: 'hanger'
    },
    {
      id: 10,
      y: -460,
      image: 'hanger'
    },
    {
      id: 11,
      type: 'stage',
      x: 150,
      y: -360,
      image: 'hanger'
    },
    {
      id: 12,
      x: 180,
      y: -180,
      image: 'stage'
    },
    {
      id: 13,
      x: 200,
      y: -180,
      image: 'stage',
      repeat: 3
    }
  ],

  backgrounds: [
    {
      id: 14,
      x: 0,
      y: 0,
      image: 'background',
      repeat: 3
    }
  ],

  wallpapers: [
    {
      id: 15,
      x: 0,
      at: {
        id: 1,
        from: 'end'
      },
      image: 'bush'
    },
    {
      id: 16,
      x: -300,
      at: {
        id: 3,
        from: 'end'
      },
      image: 'bush'
    },
    {
      id: 17,
      x: 100,
      at: {
        id: 7,
        from: 'start'
      },
      image: 'bush'
    },
    {
      id: 18,
      x: 300,
      at: {
        id: 12,
        from: 'start'
      },
      image: 'bush'
    },
    {
      id: 19,
      x: 500,
      at: {
        id: 13,
        from: 'start'
      },
      image: 'bush',
      repeat: 3
    },
    {
      id: 20,
      x: -1200,
      at: {
        id: 13,
        from: 'end'
      },
      image: 'castle',
      winner: {
        x: 85
      }
    }
  ]
}

export default stageMap

//ignorePreviousBlocks: true,
