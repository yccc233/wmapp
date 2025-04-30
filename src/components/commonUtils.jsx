// iconfont图标库：http://localhost:3000/img/iconfont/demo_index.html
import {Empty} from "antd";

export const IconFont = ({font, className, style}) => (
    <span style={style} dangerouslySetInnerHTML={{__html: font}}
          className={className ? `iconfont-css ${className}` : "iconfont-css"}
    />
);


export const PEmpty = (props) => <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    {...props}
/>;