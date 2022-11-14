<template>
<div>hellooo</div>
  <slot :em="sendd"  name="header"></slot>
</template>

<script>
export default {
  data(){
    return {
      sendd:'zzz'
    }
  },
}
</script>

<style scoped>

</style>