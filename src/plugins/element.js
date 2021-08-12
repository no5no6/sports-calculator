import { ElButton, ElHeader, ElContainer, ElFooter, ElMain, ElInput, ElCard, ElProgress, ElAffix, ElEmpty, ElDrawer, ElInputNumber } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';
const components = [ ElButton, ElHeader, ElContainer, ElFooter, ElMain, ElInput, ElCard, ElProgress, ElAffix, ElEmpty, ElDrawer, ElInputNumber]

export default (app) => {
  components.forEach(component => app.use(component))
}