# d3-ldvm-pipeline

D3.js visualization of LDVM pipeline.

### Usage

Just include the file [d3LdvmPipeline.min.js](dist/d3LdvmPipeline.min.js) together with **d3.js**
to your website and you should be good to go. Check [index.js](index.js) or [this example](example/index.html) 
to see how to use it.

The library *should* be compatible with the AMD/Common.js package format. Just remember to always
include **d3.js** as it is not a part of the library.

### Development

For development, just clone this repo and then run:

```
npm install
npm run dev-server
```

The visualization should be accessible on `localhost:9090`. You can change the parameters of the 
visualization in the [index.js](index.js) file.

You build the library using:

```
npm run build
```

### Data format

The pipeline should be represented in the following format:

```
{
   "components":[
      {
         "id":5439064,
         "uri":"http://payola.viz/#component5439064",
         "label":"nulla eiusmod commodo",
         "htmlContent":"Some <strong>html</strong> content",
         "type":"visualizer",
         "inputs":[
            {
               "id":1605089,
               "uri":"http://payola.viz/#port1605089",
               "label":"culpa ipsum sit"
            }
         ],
         "outputs":[  ]
      },
      {
         "id":5908690,
         "uri":"http://payola.viz/#component5908690",
         "label":"irure quis voluptate",
         "htmlContent":"Some <strong>html</strong> content",
         "type":"transformer",
         "inputs":[
            {
               "id":5009573,
               "uri":"http://payola.viz/#port5009573",
               "label":"cupidatat enim magna"
            }
         ],
         "outputs":[
            {
               "id":6820230,
               "uri":"http://payola.viz/#port6820230",
               "label":"ullamco cupidatat amet"
            }
         ]
      }
   ],
   "bindings":[
      {
         "sourceId":6820230,
         "targetId":1605089,
         "sourceUri":"http://payola.viz/#port6820230",
         "targetUri":"http://payola.viz/#port1605089",
         "type":"resolved"
      }
   ]
}
```

At this point, ids are optional and all components and ports are identified using uris which 
therefore have to be unique.