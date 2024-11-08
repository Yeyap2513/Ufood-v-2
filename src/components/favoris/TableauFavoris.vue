<template>
  <v-table
    height="500px"
    fixed-header
  >
    <thead>
      <tr>
        <th class="text-left">
          
        </th>
        <th class="text-left">
          Name
        </th>
        <th class="text-left">
          type
        </th>
        <th class="text-right"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(resto, index) in restaurants" :key="index" id="restaurant_row">
          <td class="col-2"><img class="img-thumbnail" :src="`${resto.pictures[0]}`" /></td>
          <td class="col-4"><router-link :to="`/restaurant/${resto.id}`">{{ resto.name }}</router-link></td>
          <td class>{{ resto.genres.join(', ') }}</td>
          <td class="col-1"><i class="bi bi-trash-fill trash_icon position-relative" title="Remove" @click="deleteResto(resto.id)"></i></td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { deleteRestoFromCollection } from '@/api/api';
import { defineComponent } from 'vue';

  export default defineComponent({
      name: "TableauFavoris",
      props: {
          restaurants: {
              type: Array<any>,
              required: false,
              default: [],
          },
          collectionId:{
            type: String,
            required: true,
          }
      },
      methods:{
        async deleteResto (restoId: string){
          try {
            const data = await deleteRestoFromCollection(this.collectionId, restoId);
            this.$emit('restoDeleted', restoId);
          } catch (error) {
            console.log(error);
          }
          
        }
      },
      emits:["restoDeleted"]

  })
</script>
<style scoped>
#restaurant_row {
  position: relative;
}

.trash_icon {
  display: none;
  font-size: 1.2rem;
  color: red;
  cursor: pointer;
}

#restaurant_row:hover .trash_icon {
  display: block;
}
</style>