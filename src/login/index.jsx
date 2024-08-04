"use client"
import Logo from "@/src/components/Logo.jsx";
import {Button, Form, Input} from 'antd';
import {useState} from "react";
import {makePost, setCookieKey} from "@/src/utils.jsx";

export default function Index() {

    const [errMsg, setErrMsg] = useState(null);

    const onFinish = (values) => {
        setErrMsg(null);
        makePost("/um/login", {username: values.username, password: values.password})
            .then(res => {
                const data = res.data;
                if (data.userId) {
                    setCookieKey('username', values.username);
                    setCookieKey('userid', data.userId);
                    if (values.username==="root") {
                        window.location.href = "/riskview/rootManage";
                    }else {
                        window.location.href = "/riskview";
                    }
                } else {
                    setErrMsg("用户名或密码错误！");
                }
            })
            .catch(err => {
                setErrMsg("服务异常！");
            });
    };

    return <div className={"login relative"}>
        <div className={"absolute"} style={{top: 0, left: 0}}>
            <Logo style={{marginLeft: 10, marginTop: 10}}/>
        </div>
        <div className={"box-area vhcenter flex-column"}>
            {
                errMsg ? <div className={"err-msg"}>{errMsg}</div> : null
            }
            <Form
                name="basic"
                labelCol={{span: 8,}}
                wrapperCol={{span: 16,}}
                style={{maxWidth: 600,}}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{required: true, message: '请输入用户名!',},]}
                >
                    <Input placeholder={"用户名"}/>
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{required: true, message: '请输入密码!',},]}
                >
                    <Input.Password placeholder={"密码"}/>
                </Form.Item>

                <Form.Item
                    wrapperCol={{offset: 8, span: 16,}}
                >
                    <Button type="primary" htmlType="submit">
                        登入
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
}