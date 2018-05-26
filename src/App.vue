<script>
import { get } from './util'

export default {
  async created () {
    console.log('start')

    const res = await get('/weapp/demo')
    console.log(1, res)
  }
}
</script>
