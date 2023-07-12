import CopyButton from '@/components/copyButton';
import {
  assertClipBoardContainsText,
  clickCopyButton,
  getElementByRole,
} from '__tests__/testUtils';
import { render } from '__tests__/wrapper';

test('copies text to clip board', async () => {
  const text = 'Hello World';
  render(<CopyButton text={text}>Copy</CopyButton>);

  await clickCopyButton(getElementByRole('button'));

  await assertClipBoardContainsText(text);
});
