import SocketBaseService from "@/parent-ui/src/main/business/common/socket/SocketBaseService";
import {eventBus} from "@/parent-ui/src/main/js/utils/WebsocketUtil";

class ExecuteOrder extends SocketBaseService {
  doSaveOrUpdateMore = (dataEntity, opt, data, store) => {
      eventBus.$emit(`get${dataEntity}Msg`, data)
  }
}

export const instance = new ExecuteOrder()
