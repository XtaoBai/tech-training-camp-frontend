<template>
  <div id="app">
    <Markdown
      v-model = "val"
      @on-ready = "onReady"
      @on-copy = "onCopy"
      @on-upload-image = "onUploadImage"
      @on-save = "onSave"
      :height ="500"    
    ></Markdown>

  </div>
</template>

<script>
import Markdown from './components/index'

export default {
  name: 'App',
  components: {
    Markdown
  },
  data: function(){
    return {
      val:''
    }
  },
  methods:{
    onReady(data){
      console.log(data);
    },
    onCopy(text){
      console.log(text);
    },
    onUploadImage(file){
      console.log(file);
    },
    onSave(data){
      console.log(data);
    }
  }
}
</script>

<style lang="less">

</style>
