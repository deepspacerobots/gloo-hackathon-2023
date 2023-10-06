import './SampleComponent.scss';
interface Props {
	title: string;
	subtitle: string;
}
const SampleComponent = (props: Props) => {
	const { title, subtitle } = props;
	return (
		<div className="sample-component">
			<h1>{title}</h1>
			<p>{subtitle}</p>
		</div>
	);
};
export default SampleComponent;
