<template>
  <div class="theteam">
    <h1 class="text-center my-3">Meet The Team</h1>
    <div class="row justify-content-center">
      <Card_member
        position="Local Guides"
        name="Võ Thị XX"
        description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum delectus amet ducimus unde labore eaque quas quam asperiores sunt, ea, et minus eligendi?"
        image="https://i.pinimg.com/736x/c4/5a/d9/c45ad9b8f4730fba4038caf7445b0f62.jpg"
        buttonText="Meet The Team"
      />
      <Card_member
        position="Local Guides"
        name="Trần Thị Y"
        description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum delectus amet ducimus unde labore eaque quas quam asperiores sunt, ea, et minus eligendi?"
        image="https://i.pinimg.com/736x/47/e6/22/47e622527d9c7213d2b0d1fe7f447c6f.jpg"
        buttonText="Meet The Team"
      />
      <Card_member
        position="Local Guides"
        name="Châu văn B"
        description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum delectus amet ducimus unde labore eaque quas quam asperiores sunt, ea, et minus eligendi?"
        image="https://i.pinimg.com/736x/dc/5f/2f/dc5f2fb25d21ef45b5745b6e215eaee8.jpg"
        buttonText="Meet The Team"
      />
    </div>
  </div>
</template>

<script setup>
import Card_member from '@/components/Card_member.vue';
</script>
