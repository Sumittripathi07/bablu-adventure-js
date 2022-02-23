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
      x: 350,
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
      x: 200,
      y: -460,
      image: 'hanger',
      repeat: 2
    },
    {
      id: 7,
      x: 300,
      y: -180,
      image: 'stage',
      width: 600
    },
    {
      id: 8,
      x: 200,
      y: -320,
      image: 'hanger',
      repeat: 2
    },
    {
      id: 9,
      x: 200,
      y: -460,
      image: 'hanger'
    },
    {
      id: 10,
      x: 250,
      y: -460,
      image: 'hanger'
    },
    {
      id: 11,
      type: 'stage',
      x: 250,
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
      x: 300,
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
      at: {
        id: 13,
        from: 'end'
      },
      x: -1200,
      y: -500,
      image: 'castle',
      winner: {
        x: 85
      }
    }
  ]
}

export default stageMap
