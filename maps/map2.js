

const stageMap = {

  timeout : 60,
  
  stages : [
    {
      id:1,
      y : -180,
      image : 'stage',
      afterPrevBlock : true
    },
    {
      id:2,
      y : -180,
      image : 'stage',
      width : 600,
      afterPrevBlock : true
    },
    {
      id:3,
      x : 350,
      y : -180,
      image : 'stage',
      width : 600,
      afterPrevBlock : true
    },
    {
      id:5,
      y : -320,
      image : 'hanger',
      afterPrevBlock : true
    },
    {
      id:6,
      x : 200,
      y : -460,
      image : 'hanger',
      afterPrevBlock : true,
      repeat:2
    },
    {
      id:7,
      x : 300,
      y : -180,
      image : 'stage',
      width : 600,
      afterPrevBlock : true
    },
    {
      id:8,
      x : 200,
      y : -320,
      image : 'hanger',
      afterPrevBlock : true,
      repeat:2
    },
    {
      id:9,
      x : 200,
      y : -460,
      image : 'hanger',
      afterPrevBlock : true
    },
    {
      id:10,
      x : 250,
      y : -460,
      image : 'hanger',
      afterPrevBlock : true
    },
    {
      id:11,
      type : 'stage',
      x : 250,
      y : -360,
      image : 'hanger',
      afterPrevBlock : true
    },
    {
      id:12,
      x : 180,
      y : -180,
      image : 'stage',
      afterPrevBlock : true
    },
    {
      id:13,
      x : 300,
      y : -180,
      image : 'stage',
      afterPrevBlock : true,
      repeat:3
    },
  ],

  backgrounds : [
    {
      id:14,
      x : 0,
      y : 0,
      image : 'background',
      repeat:3
    }
  ],

  wallpapers : [
    {
      id:15,
      x : -1200,
      at: {
        id :13,
        from :'end'
      },
      y : -500,
      image : 'castle',
      winner : {
        id : 15,
        x:130
      }
    }
  ]
}

export default stageMap;
















