<template>
  <div id="app">
    <Header />
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
import Header from '../components/Header';  
import Markdown from '../components/Markdown'

export default {
  name: 'App',
  components: {
    Header,
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

