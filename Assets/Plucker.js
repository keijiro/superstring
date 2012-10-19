#pragma strict

private var stringBuilder : StringBuilder;
private var border = 0.0;

function Awake() {
	stringBuilder = GetComponentInChildren.<StringBuilder>();
	border = transform.Find("Point 1").position.y;
}

function Start() {
	while (true) {
		while (!Input.GetMouseButton(0)) yield;

		var y0 = GetTouchPosition().y - border;
		var y0_is_plus = (y0 > 0.0);

		yield;

		while (Input.GetMouseButton(0)) {
			var y1 = GetTouchPosition().y - border;
			if (y0_is_plus ^ (y1 > 0.0)) break;
			yield;
		}

		yield;

		while (true) {
			var y2 = GetTouchPosition().y - border;
			if (!Input.GetMouseButton(0) || (y0_is_plus ^ (y2 < 0.0))) {
				stringBuilder.ResetMidpoint();
				break;
			}
			if (Mathf.Abs(y2) > 1.5) {
				stringBuilder.StartWave();
				while(Input.GetMouseButton(0)) yield;
				break;
			}
			stringBuilder.SetMidpoint(GetTouchPosition());
			yield;
		}
	}
}

private function GetTouchPosition() {
	var pos = Input.mousePosition - Vector3.forward * camera.main.transform.position.z;
	return camera.main.ScreenToWorldPoint(pos);
}
