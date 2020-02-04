<?php
$number_of_floors = 9;
?>

<html>
    <head>
		<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
        <script src="js/elevator.js"></script>
		<link rel="stylesheet" href="css/style.css">

		<script>
            $(document).ready(function(){
                $("#elevator-container").awesomeElevator({
                    floor_height: 86,
                    main_delay: 2000,
                    animation: 800,
                    $floor_button: $("#floors div a"),
                    $start: $("#start-journey"),
                    $elevator_button: $("#elevator-buttons a"),
                    $the_elevator: $("#the-elevator")
                });
            });
		</script>
    </head>
    <body>

		<main>
			<div id="elevator-container">

				<div id="the-elevator" data-currentlocation="1">
					<div id="elevator-buttons">
						<?php for ($i = $number_of_floors; $i > 0; $i--): ?>
						<a href="#" class="eb<?php echo $i; ?>"><?php echo $i; ?></a>
						<?php endfor; ?>
					</div>
				</div>

				<div id="floors">
					<?php for ($i = $number_of_floors; $i > 0; $i--): ?>
						<div id="floor<?php echo $i; ?>" class="floor" data-floor="<?php echo $i; ?>">
							<span><?php echo $i; ?></span>
							<a href="#"><i class="arrow up"></i></a>
						</div>
					<?php endfor; ?>
				</div>
			</div>

			<button id="start-journey">Start journey</button>

		</main>

    </body>
</html>