import { shallowMount, createLocalVue } from '@vue/test-utils';
import Login from '../login.vue';
import antd from 'ant-design-vue';

const localVue = createLocalVue();
localVue.use(antd);

describe('login.vue', () => {
    let wrapper: any;
    beforeEach(() => {
        wrapper = shallowMount(Login);
    });
    afterEach(() => {
        wrapper.destroy();
    })
    it('click Btn func is called', () => {
        const mockFn = jest.fn();
        wrapper.setMethods({
            submitForm: mockFn,
        });
        wrapper.find('.submit_btn').trigger('click');
        expect(mockFn).toBeCalled();
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
})