<template>
<!--  <div class="container" :style="`background-image: url('${extra}')`">-->
<!--    &lt;!&ndash;<img :src="extra"/>&ndash;&gt;-->
<!--  </div>-->

  <div class="container" :style="imgstyle"></div>
</template>

<script>
  export default {
    name: 'ImageShow',
    props: ['extra'],
    computed: {
      imgstyle: function () {
        // return (this.extra && this.extra.message) || '无消息';

        console.log(this.extra);

        return `background-image:url('${this.extra.url}');`
      }
    }
  };
</script>

<style scoped>
  .container {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    background-size: 90%;
    background-position-x: center;
    background-position-y: center;
    background-repeat: no-repeat;

  }

  img {
    height: 100%;
  }
</style>
