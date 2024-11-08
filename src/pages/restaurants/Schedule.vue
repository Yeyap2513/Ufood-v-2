<template>
    <table class="table table-borderless">
        <thead>
            <tr>
            <th scope="col">Day</th>
            <th scope="col">Hours</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(hours, day) in restoHours" :key="day">
            <td>{{ day }}</td>
            <td>{{ hours }}</td>
            </tr>
        </tbody>
    </table>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

    interface OpeningHours {
        [day: string]: string;
    }

    export default defineComponent({
        name:"Schedule",
        props:{
            restoHours:{
                type: {} as () => OpeningHours,
                required: false,
                default: () => {},
            }
        }
    })
</script>