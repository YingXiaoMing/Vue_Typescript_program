
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Attachment from '../index.vue';
import antd from 'ant-design-vue';

const localVue = createLocalVue();
localVue.use(antd);

describe('Attachment.vue', () => {
    // 测试内容: props
    // 自定义props传递到Attachment组件，判断组件是否有获取到props
    it('props test', () => {
        const attchmentProps = {
            employeeId: '123',
            visible: true,
            attachmentList: ['213'],
            employeePropertyId: '456',
            pathName: '测试',
            keyName: '测试关键',
        };
        const wrapper = shallowMount(Attachment, {
            localVue,
            propsData: attchmentProps,
        });
        expect(wrapper.props().employeeId).toBe('123');
        expect(wrapper.props().visible).toBe(true);
        expect(wrapper.props().attachmentList.length).toBe(attchmentProps.attachmentList.length);
        expect(wrapper.props().employeePropertyId).toBe('456');
        expect(wrapper.props().pathName).toBe('测试');
        expect(wrapper.props().keyName).toBe('测试关键');
        // 每一个it最后销毁wrapper
        wrapper.destroy();
    });
});
